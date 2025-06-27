from typing import Optional, List
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import psycopg2
from .env import POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB

#Инициализация FastAPI
app = FastAPI()

#Запрос
class CommandRequest(BaseModel):
    login: str
    password: str
    command: int
    args: str

#Подключение к БД
conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database=POSTGRES_DB,
    user=POSTGRES_USER,
    password=POSTGRES_PASSWORD
)

#Ответ
class CommandResponse(BaseModel):
    code: int
    n: Optional[int] = None
    data: Optional[List[str]] = None

#Кэширование пароля
def pass_to_hash(password: str) -> int:
    i = 0
    res = 0
    for c in password:
        res += ord(c) + i^2
    return res

#Проверка логина и пароля
def authenticate_user(login: str, password: str) -> bool:
    cur = conn.cursor()
    password_hash = pass_to_hash(password)
    cur.execute("SELECT password_hash FROM authdata WHERE login = %s;", (login,))
    result = cur.fetchone()
    if result:
        if result[0] == password_hash:
                cur.close()
                return True
        else:
                cur.close()
                return False
    else:
            cur.execute("INSERT INTO authdata (login, password_hash) VALUES (%s, %s);", (login, password_hash))
            conn.commit()
            cur.close()
            return True

#Обработка команд
def process_command(login:str, command: int, args: str) -> CommandResponse:
    match command:
        #"прозвон" сервера
        case 1:
            return CommandResponse(code=0)
        #Добавление записи
        case 10:
            args = args.split(',')
            cur = conn.cursor()
            cur.execute("INSERT INTO itemdata (login, listname, itemname, ammount) SELECT %s, %s, %s, %s WHERE NOT EXISTS (SELECT 1 FROM itemdata WHERE login = %s AND listname = %s AND itemname = %s AND ammount = %s);", (login, args[0], args[1], int(args[2]), login, args[0], args[1], int(args[2])))
            conn.commit()
            cur.close()
            return CommandResponse(code=0, data=["Запись добавлена"])
        #Удаление записи
        case 20:
            args = args.split(',')
            cur = conn.cursor()
            try:
                cur.execute("DELETE FROM itemdata WHERE login = %s AND listname = %s AND itemname = %s AND ammount = %s;", (login, args[0], args[1], int(args[2])))
                conn.commit()
                cur.close()
                return CommandResponse(code=0, data=["Запись удалена"])
            except:
                cur.close()
                return CommandResponse(code=1, data=["Запись не найдена"])
        #Удаление таблицы
        case 21:
            cur = conn.cursor()
            try:
                cur.execute("DELETE FROM itemdata WHERE login = %s AND listname = %s;", (login, args))
                conn.commit()
                cur.close()
                return CommandResponse(code=0, data=["Таблица удалена"])
            except:
                cur.close()
                return CommandResponse(code=1, data=["Таблица не найдена"])
        #Возврат списка пользователей
        case 30:
            cur = conn.cursor()
            cur.execute("SELECT DISTINCT listname FROM itemdata where login = %s;", (login,))
            results = [row[0] for row in cur.fetchall()]
            cur.close()
            return CommandResponse(code=0, n = len(results), data=results)
        #Вовзрат элементов списка
        case 31:
            cur = conn.cursor()
            cur.execute("SELECT itemname, ammount FROM itemdata where login = %s and listname = %s;", (login, args))
            results = [(str(row[0]) + ":" + str(row[1])) for row in cur.fetchall()]
            cur.close()
            return CommandResponse(code=0, n = len(results), data=results)
        case _:
            raise HTTPException(status_code=404, detail="Неизвестная команда")

                
            

#Основной эндпоинт
@app.post("/execute", response_model=CommandResponse)
async def execute_command(req: CommandRequest):
    if not authenticate_user(req.login, req.password):
        raise HTTPException(status_code=401, detail="Отказано в доступе")

    response = process_command(req.login, req.command, req.args)
    return response

#Завершение работы сервера
async def shutdown_event():
    conn.close()
    print("Сервер выключается...")

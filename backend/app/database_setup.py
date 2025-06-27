import psycopg2
from .env import POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB

conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database=POSTGRES_DB,
    user=POSTGRES_USER,
    password=POSTGRES_PASSWORD
)

cur = conn.cursor()
#cur.execute("CREATE TABLE AuthData (login VARCHAR(255) NOT NULL, password_hash INT NOT NULL);")
#conn.commit()
cur.execute("CREATE TABLE ItemData (login VARCHAR(255) NOT NULL, listName VARCHAR(255), itemName VARCHAR(255), ammount INT NOT NULL);")
conn.commit()
print("Готово")

cur.close()
conn.close()

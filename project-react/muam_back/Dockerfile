FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

COPY ./entrypoint /entrypoint

RUN sed -i 's/\r$//g' /entrypoint
RUN chmod +x /entrypoint

EXPOSE 8000

ENTRYPOINT [ "/entrypoint" ]
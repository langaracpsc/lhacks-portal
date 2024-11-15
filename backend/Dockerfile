FROM python:3.12.5-slim

WORKDIR /app
RUN apt-get update && apt-get install -y \
    libpq-dev gcc

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .
# COPY .env .env

ENV FLASK_APP=api.py
ENV FLASK_ENV=development
# ENV PORT=5001
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5001

EXPOSE 5001

CMD ["sh", "-c", "alembic upgrade head && flask run --host=0.0.0.0 --port 5001"]


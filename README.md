# lhacks-portal

Portal for Langara Hacks

# Build

1. Add an `alembic.ini` file in /backend

2. Create and populate `.env` files for the frontend and backend (use template `.templateenv` for reference)

3. Run both docker compose files

```
cd frontend;

docker compose up --build -d;

cd ../backend;

docker compose up --build -d;
```

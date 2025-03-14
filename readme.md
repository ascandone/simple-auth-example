## endpoints
```
# needs a json body of type { username: string, password: string }
POST /register

# needs a json body of type { username: string, password: string }
GET /login

# protected routes: (via the 'token' cookie)
GET /counter
POST /counter/increment
```


## local dev: backend

```bash
# run the db (in the root folder)
docker compose up

# in the "backend" folder:

# install deps
npm i

# run migrations
npm run migrate

# run dev server
npm run dev
```

## local dev: frontend

```bash
# in the "frontend" folder

# install deps
npm i

# run dev server
npm run dev

# go to http://127.0.0.1:8080/
```

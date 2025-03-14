## local dev: frontend

```bash
# in the "fronend" folder

# install deps
npm i

# run dev server
npm run dev

# go to http://127.0.0.1:8080/
```

## local dev: backend

```bash
# run the db (in the root folder)
docker compose up

# in the "backend" folder:

# run migrations
npm run migrate

# run dev server
npm run dev

# go to http://127.0.0.1:8080/
```

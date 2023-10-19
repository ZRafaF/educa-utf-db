# Educa UTF DB

This project is the database of the application [educa-utf](https://github.com/ZRafaF/educa-utf). It uses [PocketBase](https://pocketbase.io/) as the Database

## Local Serve

The following command is only for LINUX

To serve the application run

```bash
UTF_AUTH_TOKEN=meutokendeautenticacao ./pocketbase serve
```

ou

```bash
source secrets.txt && ./pocketbase serve
```

## JavaScript Extension

We are using JavaScript to extend the functionalities of the DB, you can find them at `pb_hooks/`

## Schema

The **collections schema** can be found at `pb_schema.json` it was generated with the built in `export collections` functionality. Have a look at this issue for more info [https://github.com/pocketbase/pocketbase/discussions/816](https://github.com/pocketbase/pocketbase/discussions/816).

## Using Docker

Repositório no Docker-hub[https://hub.docker.com/r/zrafaf/educa_utf_pocketbase](https://hub.docker.com/r/zrafaf/educa_utf_pocketbase)

1. [Install Docker](https://docs.docker.com/get-docker/) on your machine.
2. Build your container: `docker build -t educa_utf_pocketbase .`.
3. Tag you image `docker tag educa_utf_pocketbase zrafaf/educa_utf_pocketbase`
4. Publish your image `docker push zrafaf/educa_utf_pocketbase`
5. Run your container: `docker run -p 3000:3000 educa_utf_pocketbase`.

You can view your images created with `docker images`.

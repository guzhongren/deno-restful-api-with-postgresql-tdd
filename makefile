dev:
	deno run --allow-net --allow-env ./src/index.ts

test:
	deno test --allow-env --allow-net -L info

db:
	cd ./_resources/Iaas && docker-compose up -d

killDB:
	cd ./_resources/Iaas && docker-compose stop

bundle:
	mkdir dist
	deno bundle src/index.ts dist/platform.js

start:
	APP_PORT=1234 deno run --allow-net --allow-env ./dist/platform.js 

updateDeps:
	deno cache --lock=lock.json --lock-write ./deps.ts

cache:
	deno cache -r --lock=lock.json ./deps.ts

image:
	docker build -t guzhongren/deno-restful-api-with-pg .

docker-compose:
	docker-compose up -d
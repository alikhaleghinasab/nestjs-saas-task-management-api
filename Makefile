.PHONY: up down build logs ps clean

up:               
	docker compose up -d

down:            
	docker compose down

build:            
	docker compose build --no-cache

logs:             
	docker compose logs -f app

ps:                
	docker compose ps

clean:            
	docker compose down -v

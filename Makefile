dev:
	node ./scripts/atsuDev.js
	docker-compose up -d
	cd frontend && \
	npm run dev
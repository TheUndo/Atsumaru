dev:
	node ./scripts/atsuDev.js
	docker-compose up -d
	node ./scripts/openBrowser.js
	cd frontend && \
	npm run dev
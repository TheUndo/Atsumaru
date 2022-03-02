# Atsumaru is currently in alpha pre-release
We're still working on vital components for the reader, follow this repo for updates or join our [Discord server](https://discord.gg/Tj4QmEF4uV).
***

# Atsumaru | Manga Reader
Atsumaru is an open source manga reader application for Android, IOS & Web

## Features
- Advanced, fully customizable reader
- Offline mode
- Anilist.co integration
- Multiple sources
- Community driven

## Contributing
Contributions of any kind are welcomed. Feel free to make pull requests with new features, improvements or modification that would benefit the application. Opening relevant issues is also welcomed and appreciated.

For support/discussion visit the [Atsumaru Discord server](https://discord.gg/Tj4QmEF4uV),

## Installing for development
All modern operating systems are supported GNU/Linux, Windows, Mac OS.
### Prerequisites
Install the following beforehand
- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.dev/)

### Steps
Run in your terminal
1. Clone the repository
   ```sh
   git clone https://github.com/TheUndo/atsumaru.git
    ```
2. ```sh
   cd Atsumaru
    ```
3. Rename `.env.example` to `.env`

   *Unix/Bash:*
   ```sh
   $ mv .env.example .env
   ```
   *Windows:*
   ```sh
   rename .env.example .env
   ```
4. Build and start the backend. Omit the `-d` flag if you want to use another terminal for the frontend
   ```sh
   docker-compose up -d
   ```
5. ```sh
   cd frontend
   ```
6. Start frontend
   ```sh
   npm i && npm run dev
   ```

After all containers are built open <a href="http://localhost:3000" target="_blanc">http://localhost:3000</a> to view the development app.

## Technical details
| Role                 | Technology                                                                                                                              |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Database             | <a href="https://www.mongodb.com/" target="_blanc">MongoDB</a>                                                                          |
| Backend              | [Node.js](https://nodejs.dev/) + <a href="https://www.typescriptlang.org/" target="_blanc">TypeScript</a>                               |
| Frontend UI          | <a href="https://reactjs.org/" target="_blanc">React</a> + <a href="https://www.typescriptlang.org/" target="_blanc">TypeScript</a>     |
| Frontend bundler     | <a href="https://vitejs.dev/" target="_blanc">Vite</a> (<a href="https://rollupjs.org/guide/en/" target="_blanc">rollup</a> internally) |
| Router/Reverse proxy | <a href="https://nginx.org/en/" target="_blanc">NGINX</a>                                                                               |
| Cache                | <a href="https://redis.io/" target="_blanc">Redis</a>                                                                                   |
| Search engine        | <a href="https://www.meilisearch.com/" target="_blanc">Meilisearch</a>                                                                  |
| Containerization     | <a href="https://docs.docker.com/compose/" target="_blanc">Docker compose</a>                                                           |

### Why Docker?
We use Docker to provide seamless support cross platform, for managing multiple micro services written in different languages and for offering great scaling options. Atsumaru uses over 8 different technologies, it's therefore very hard to install everything with the correct version, and make them behave together the same across Linux, Windows and Mac OS. Docker completely solves this issue.

### Why TypeScript?
TypeScript is a strictly typed superset of JavaScript, it allows for static type checking at compilation time. It helps greatly in eliminating needless type errors which often occur with vanilla JavaScript. This is very useful for large projects like Atsumaru and ensures your code can be understood by others and their IDEs.

If you want to contribute but you do not know TypeScript, this is likely not an issue. Since TypeScript is incredibly powerful it will infer most types and provide helpful error messages to guide you, as mentioned before, TypeScript is a superset of JavaScript, it uses JavaScript syntax and compiles to JavaScript. If you need help, we're more than happy to provide support in our [Discord server](https://discord.gg/Tj4QmEF4uV).
const path = require("path");
const child_process = require("child_process");
const { promises: fs } = require("fs");

const checks = ["../frontend", "../api", "../scraper"];

const log = (...args) =>
  console.info("\x1b[36m[\x1b[35mATSU DEV\x1b[36m]", ...args, "\x1b[0m");

const toCheck = checks.map(relPath =>
  path.resolve(__dirname, relPath, "node_modules"),
);

(async () => {
  await cpEnv(path.resolve(__dirname, "../.env.dev.example"));
  for (const path of toCheck) await check(path);

  log("\x1b[32mLooking good, now starting dev server");
})();

async function check(path) {
  log(`CHECKING \x1b[37m\x1b[4m${path}\x1b[0m...`);
  try {
    await fs.lstat(path);
    log(`\x1b[32mEXISTS \x1b[37m\x1b[4m${path}\x1b[0m!`);
  } catch (e) {
    log(`\x1b[31mENOENT \x1b[37m\x1b[4m${path}\x1b[0m - Proceeding to install`);

    install(path);
  }
}

function install(absPath) {
  child_process.exec(
    `cd ${path.resolve(absPath, "..")} && \
    npm ci --also=dev`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      if (stderr) log(`NPM_ERR: ${stderr}`);

      log(stdout);
    },
  );
}

async function cpEnv(absPath) {
  log(`CHECKING \x1b[37m\x1b[4m${path}`);
  const envPath = path.join(__dirname, "..", "/.env");
  try {
    await fs.stat(envPath);
    log(`\x1b[32mEXISTS \x1b[37m\x1b[4m${envPath}`);
  } catch (e) {
    log(`\x1b[31mENOENT \x1b[37m\x1b[4m${envPath}\x1b[0m - Copying`);
    try {
      await fs.copyFile(absPath, envPath);
    } catch (e) {
      log(e);
    }
  }
}

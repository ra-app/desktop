const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const readdir = (path) => new Promise((resolve, reject) => {
  fs.readdir(path, (err, files) => {
    if (err) reject(err);
    else resolve(files);
  })
});

const readJson = (file) => new Promise((resolve, reject) => {
  fs.readFile(file, (err, data) => {
    if (err) return reject(err);
    try {
      resolve(JSON.parse(data.toString()));
    } catch (err2) {
      reject(err2);
    }
  });
});

const writeJson = (file, json) => new Promise((resolve, reject) => {
  fs.writeFile(file, JSON.stringify(json, null, 4), (err) => {
    if (err) reject(err);
    else resolve();
  });
});

let currentLocale = 'en';
let locales = null;
const loadLocales = async () => {
  const dirs = await readdir('./_locales');
  const promises = dirs.map(async dir => {
    const json = await readJson(`./_locales/${dir}/messages.json`);
    return {locale: dir, data: json};
  })
  const arr = await Promise.all(promises);
  const mapped = arr.reduce((map, loc) => {
    map[loc.locale] = loc.data;
    return map;
  }, {});
  locales = mapped;
}

const saveLocales = async () => {
  const promises = Object.keys(locales).map(async dir => {
    return writeJson(`./_locales/${dir}/messages.json`, locales[dir]);
  });
  return Promise.all(promises);
}

const get_line = (message) => new Promise((resolve, reject) => {
  if (message) process.stdout.write(`${message}: `);
  rl.once('line', resolve);
  rl.once('error', reject);
});

const add = async () => {
  const key = await get_line("Enter translation key");
  if (locales[currentLocale][key]) throw new Error(`${key} already exists`);
  const message = await get_line("Enter translation text");
  const description = await get_line("Enter text description");
  Object.keys(locales).forEach(locale => {
    locales[locale][key] = {message, description};
  });
  console.log(`Added translation for ${key} => ${message}`);
}

const del = async () => {
  const key = await get_line("Enter translation key");
  if (!locales[currentLocale][key]) throw new Error(`${key} doesn't exist`);
  Object.keys(locales).forEach(locale => {
    delete locales[locale][key];
  });
}

const actions = {
  add,
  del,
  save: saveLocales,
  quit() {
    process.exit();
  },
};

const main_loop = async () => {
  await loadLocales();
  while (true) {
    const action = await get_line("Enter action [add|edit|remove|quit]");
    try {
      if (actions[action]) {
        await actions[action]();
      }
    } catch (err) {
      console.error(`${action}`, err);
    }
  }
}

main_loop()
  .then(() => {
    console.log('Main loop exited');
  })
  .catch((err) => {
    console.error('Main loop error', err);
  });

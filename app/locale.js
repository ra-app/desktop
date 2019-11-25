const path = require('path');
const fs = require('fs');
const _ = require('lodash');

function normalizeLocaleName(locale) {
  if (/^en-/.test(locale)) {
    return 'en';
  }

  return locale;
}

const availableLocales = [
  'ar', 'bg', 'ca', 'cs', 'da', 'de', 'el', 'en', 'es', 'et', 'fa', 'fi', 'fr', 'he', 'hi',
  'hr', 'hu', 'id', 'it', 'ja', 'km', 'kn', 'ko', 'lt', 'mk', 'nb', 'nl', 'nn', 'pl', 'pt_BR',
  'pt_PT', 'ro', 'ru', 'sk', 'sl', 'sq', 'sr', 'sv', 'th', 'tr', 'uk', 'vi', 'zh_CN', 'zh_TW',
];

function getAvailableLocales() {
  return availableLocales;
}

function getLocaleMessages(locale) {
  const onDiskLocale = locale.replace('-', '_');

  const targetFile = path.join(
    __dirname,
    '..',
    '_locales',
    onDiskLocale,
    'messages.json'
  );

  return JSON.parse(fs.readFileSync(targetFile, 'utf-8'));
}

function load({ appLocale, logger } = {}) {
  if (!appLocale) {
    throw new TypeError('`appLocale` is required');
  }

  if (!logger || !logger.error) {
    throw new TypeError('`logger.error` is required');
  }

  const english = getLocaleMessages('en');

  // Load locale - if we can't load messages for the current locale, we
  // default to 'en'
  //
  // possible locales:
  // https://github.com/electron/electron/blob/master/docs/api/locales.md
  let localeName = normalizeLocaleName(appLocale);
  let messages;

  try {
    messages = getLocaleMessages(localeName);

    // We start with english, then overwrite that with anything present in locale
    messages = _.merge(english, messages);
  } catch (e) {
    logger.error(
      `Problem loading messages for locale ${localeName} ${e.stack}`
    );
    logger.error('Falling back to en locale');

    localeName = 'en';
    messages = english;
  }

  return {
    name: localeName,
    messages,
  };
}

module.exports = {
  load,
  getAvailableLocales,
};

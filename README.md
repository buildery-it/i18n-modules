@entva/i18n-modules
===================

CSS Modules for i18n. Use local file.translations.json files and gather them up in larger dictionaries for translation tools on build step. Pairs well with [react-local](https://github.com/entva/react-local). Your translation tool must support nested JSON format.

## Usage:

### Setup

Create an options RC file in your project's root named `.i18n-modules-rc` with this example content:
```json
{
  "keysRoot": "./src",
  "moduleEnding": ".translations.json",
  "dictionaryPattern": "./dictionaries/[locale_code].json"
}
```

### Working with modules

Create a translations module `file.translations.json`:

```json
{
  "de-DE": {
    "content": {
      "totally": {
        "necessary": {
          "nesting": "Majestätischer Inhalt"
        }
      }
    },
    "title": "Unglaublicher Titel"
  },
  "en-US": {
    "content": {
      "totally": {
        "necessary": {
          "nesting": "Majestic content"
        }
      }
    },
    "title": "Amazing title"
  }
}

```
You need to pay attention to the language names in your modules, they must match the language names in your dictionaries. The language names in the modules will be used to match the dictionaries.

Import translations:

```javascript
import dictionary from './file.translations.json';
// Pass the dictionary to your translations library, e.g. react-local.
```

### CLI:

 - `npx @entva/i18n-modules build` will build all dictionaries from modules
 - `npx @entva/i18n-modules update` will update all modules from dictionaries. This will not create any new module files from dictionary as this is likely a result of a typo.
 - `npx @entva/i18n-modules clean` will remove all generated modules from dictionaries

#### env:

We support `I18N_MODULES_CONTEXT` env variable to set current working directory to something else. When set CLI will look for the RC file relative to that context folder. In addition when running the `@entva/i18n-modules` CLI all relative file paths in the RC file will be relative to that context. `I18N_MODULES_CONTEXT` itself accepts paths relative to current working directory, e.g. one could set `I18N_MODULES_CONTEXT=./frontend/src` and it would work.


## Debugging

This module uses [debug](https://github.com/visionmedia/debug) internally with label `i18n_modules`. To debug use DEBUG=i18n_modules in your env: `DEBUG=i18n_modules npx @entva/i18n-modules build`.

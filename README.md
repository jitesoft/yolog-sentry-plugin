# Yolog Sentry plugin

[![npm (scoped)](https://img.shields.io/npm/v/@jitesoft/yolog-sentry-plugin)](https://www.npmjs.com/package/@jitesoft/yolog-sentry-plugin)
[![Known Vulnerabilities](https://snyk.io/test/npm/@jitesoft/yolog-sentry-plugin/badge.svg)](https://snyk.io/test/npm/@jitesoft/yolog-sentry-plugin)
[![pipeline status](https://gitlab.com/jitesoft/open-source/javascript/yolog-plugins/sentry/badges/master/pipeline.svg)](https://gitlab.com/jitesoft/open-source/javascript/yolog-plugins/sentry/commits/master)
[![coverage report](https://gitlab.com/jitesoft/open-source/javascript/yolog-plugins/sentry/badges/master/coverage.svg)](https://gitlab.com/jitesoft/open-source/javascript/yolog-plugins/sentry/commits/master)
[![npm](https://img.shields.io/npm/dt/@jitesoft/yolog-sentry-plugin)](https://www.npmjs.com/package/@jitesoft/yolog-sentry-plugin)
[![Back project](https://img.shields.io/badge/Open%20Collective-Tip%20the%20devs!-blue.svg)](https://opencollective.com/jitesoft-open-source)


Plugin for the [`@jitesoft/yolog`](https://www.npmjs.com/package/@jitesoft/yolog) logger to post logs and errors to Sentry.

## Usage:

Install with your favorite package manager!

```bash
npm i @jitesoft/yolog-sentry-plugin --save
yarn add @jitesoft/yolog-sentry-plugin
```

The plugin uses the `@sentry/minimal` package to make sure that it works on both browser and node alike.
You have to install the sentry plugin required for your current environment (`@sentry/node`, `@sentry/browser`) 
and set it up as you wish.  
When that is done, the `yolog-sentry-plugin` will be able to send its logs and errors to sentry.

```js
import logger from '@jitesoft/yolog';
import SentryPlugin from '@jitesoft/yolog-sentry-plugin';
import * as Sentry from '@sentry/node (or browser)';

Sentry.init({
  dsn: 'some-dsn-to-connect-to-sentry'
});

logger.addPlugin(new SentryPlugin());
logger.alert('Oh no!');
```

It is possible to add `tags`, `extras` and `user` to the data sent to sentry, the way to do this is to
add a `provider` to the plugin statically.  
The providers are callback functions which will be used to fetch the data required. The `tags` and `extras` providers
should return objects with standard key-value pairs while the `userProvider` should return a user object. For more documentation on what values are expected and/or 
what will happen to them, refer to the Sentry [documentation](https://docs.sentry.io/platforms/javascript/#adding-context).

Currently, the `fingerprint` is the full message that is passed through the logger.

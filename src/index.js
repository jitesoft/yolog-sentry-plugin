import { Plugin } from '@jitesoft/yolog';
import * as MinimalSentry from '@sentry/minimal';

export default class Sentry extends Plugin {
  static #tagsProvider = async () => ({});
  static #extraProvider = async () => ({});
  static #userProvider = async () => null;

  static setTagProvider (cb) {
    Sentry.#tagsProvider = cb;
  }

  static setExtraProvider (cb) {
    Sentry.#extraProvider = cb;
  }

  static setUserProvider (cb) {
    Sentry.#userProvider = cb;
  }

  #errorMapping = {
    debug: 'debug',
    info: 'info',
    warning: 'warning',
    error: 'error',
    critical: 'critical',
    alert: 'critical',
    emergency: 'fatal'
  };

  #throwOn = ['fatal', 'critical', 'error'];

  /**
   * Method called when a log message is intercepted and the plugin is listening to the given tag.
   *
   * @param {String} tag Tag which was used when logging the message.
   * @param {Number} timestamp Timestamp (in ms) when the log was intercepted by the Yolog instance.
   * @param {String} message
   * @param {Error} error
   * @return Promise<void>
   * @abstract
   */
  async log (tag, timestamp, message, error) {
    const tags = await Sentry.#tagsProvider();
    const user = await Sentry.#userProvider();
    const extra = await Sentry.#extraProvider();

    MinimalSentry.withScope(scope => {
      for (const t of Object.keys(tags)) {
        scope.setTag(t, tags[t]);
      }
      for (const e of Object.keys(extra)) {
        scope.setExtra(e, extra[e]);
      }

      if (user) {
        scope.setUser(user);
      }

      tag = (this.#errorMapping[tag.toLowerCase()]) ? this.#errorMapping[tag.toLowerCase()] : 'log';

      scope.setFingerprint([message]);
      scope.setLevel(tag);
      if (this.#throwOn.some((t) => t === tag)) {
        MinimalSentry.captureException(error);
      } else {
        MinimalSentry.captureMessage(message);
      }
    });
  }
}

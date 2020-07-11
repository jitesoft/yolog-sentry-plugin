import SentryPlugin from './../src';
import SentryTestkit from 'sentry-testkit';
import * as Sentry from '@sentry/browser';

const { testkit, sentryTransport } = SentryTestkit();

Sentry.init({
  dsn: { port: 1231, protocol: 'https', user: 'test', pass: 'none!', host: 'examle.com', projectId: '123' },
  transport: sentryTransport
});

describe('Test slack plugin.', () => {
  let plugin = null;

  beforeEach(() => {
    plugin = new SentryPlugin();
  });

  afterEach(() => testkit.reset());

  test('Sends exception on higher level messages.', async () => {
    await plugin.log('emergency', Date.now(), 'Test emergency', new Error('err'));
    await plugin.log('alert', Date.now(), 'Test alert', new Error('err'));
    await plugin.log('critical', Date.now(), 'Test critical', new Error('err'));
    await plugin.log('error', Date.now(), 'Test error.', new Error('err'));

    expect(testkit.reports()).toHaveLength(4);
  });

  test('Sends message on lower level messages', async () => {
    await plugin.log('debug', Date.now(), 'Test debug', new Error('err'));
    await plugin.log('info', Date.now(), 'Test info', new Error('err'));
    await plugin.log('warning', Date.now(), 'Test warning', new Error('err'));
    expect(testkit.reports()).toHaveLength(3);
  });

  test('Tags are included in produced payload.', async () => {
    SentryPlugin.setTagProvider(async () => {
      return {
        a: 'b',
        c: 'd',
        e: 'f'
      };
    });

    await plugin.log('info', Date.now(), 'Test info', new Error('err'));
    expect(testkit.reports()).toHaveLength(1);
    expect(testkit.reports()[0].tags).toEqual({ a: 'b', c: 'd', e: 'f' });
  });

  test('Extra are included in produced payload.', async () => {
    SentryPlugin.setExtraProvider(async () => {
      return {
        a: 'b',
        c: 'd',
        e: 'f'
      };
    });

    await plugin.log('info', Date.now(), 'Test info', new Error('err'));
    expect(testkit.reports()).toHaveLength(1);
    expect(testkit.reports()[0].extra).toEqual({ a: 'b', c: 'd', e: 'f' });
  });

  test('User are included in produced payload.', async () => {
    SentryPlugin.setUserProvider(async () => {
      return {
        email: 'test@jitesoft.com',
        name: 'Johannes'
      };
    });

    await plugin.log('info', Date.now(), 'Test info', new Error('err'));
    expect(testkit.reports()).toHaveLength(1);
    expect(testkit.reports()[0].user).toEqual({ email: 'test@jitesoft.com', name: 'Johannes' });
  });

  test('Message is the same in the error as in the payload.', async () => {
    await plugin.log('alert', Date.now(), 'Test alert', new Error('err'));
    expect(testkit.reports()).toHaveLength(1);
    expect(testkit.getExceptionAt(0).message).toEqual('err');
  });

  test('Tag is as expected.', async () => {
    const expectedMapping = {
      debug: 'debug',
      info: 'info',
      warning: 'warning',
      error: 'error',
      critical: 'critical',
      alert: 'critical',
      emergency: 'fatal'
    };

    for (const key of Object.keys(expectedMapping)) {
      await plugin.log(key, 0, 'message');
      expect(testkit.reports()[0].level).toEqual(expectedMapping[key]);
      testkit.reset();
    }
  });

  test('Custom tag becomes "log".', async () => {
    await plugin.log('Hajj', 0, 'message');
    expect(testkit.reports()[0].level).toEqual('log');
  });

  test('Fingerprint is same as message.', async () => {
    await plugin.log('Hajj', 0, 'message');
    expect(testkit.reports()[0].originalReport.fingerprint[0]).toEqual('message');
  });
});

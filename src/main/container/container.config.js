import { TOKENS } from './types.js';
import { Container } from 'brandi';
import { NodeRFC } from '../rfc/services/node-rfc';
import { FakeRFC } from '../rfc/services/fake-rfc';
import pkg from '../../../package.json';

const container = new Container();

container
  .bind(TOKENS.RFC_SERVICE)
  .toInstance(pkg.debug.env.FAKE_RFC_SERVICE ? FakeRFC : NodeRFC) /* ← Binds the token to an instance */
  .inSingletonScope();

export { container };

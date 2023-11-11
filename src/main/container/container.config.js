import { TOKENS } from './types.js';
import { Container } from 'brandi';
import { NodeRFC } from '../rfc/services/node-rfc.js';

const container = new Container();
container
  .bind(TOKENS.RFC_SERVICE)
  .toInstance(NodeRFC) /* ← Binds the token to an instance */
  .inSingletonScope();

export { container };

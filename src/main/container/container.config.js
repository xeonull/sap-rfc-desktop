import { TOKENS } from './types.js';
// import { IRFCService } from "@/types/Service.interface";
import { Container } from 'brandi';
import noderfc from 'node-rfc';
// container.register<IRFCService>(TYPES.RFC_SERVICE, {
//   useClass: SAPRFCService,
// });

const container = new Container();
container
  .bind(TOKENS.RFC_SERVICE)
  .toInstance(noderfc.Client) /* ← Binds the token to an instance */
  .inTransientScope(); /*    ← in transient scope. */

export { container };

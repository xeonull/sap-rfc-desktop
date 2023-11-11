import 'reflect-metadata';
import { container } from 'tsyringe';
import { TYPES } from './types.js';
// import { IRFCService } from "@/types/Service.interface";
import noderfc from '../rfc/services/node-rfc.js';

// container.register<IRFCService>(TYPES.RFC_SERVICE, {
//   useClass: SAPRFCService,
// });

container.register(TYPES.RFC_SERVICE, {
  useClass: noderfc,
});

export { container };

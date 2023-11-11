import noderfc from 'node-rfc';

@injectable()
export class NodeRFC {
  noderfc
  constructor(options){
    noderfc = new noderfc.Client(options);
  }
}
import noderfc from 'node-rfc';

export class NodeRFC {
  client;
  async open(clientConfig) {
    this.client = new noderfc.Client(clientConfig);
    await this.client.open();
  }
  async call(fm, params) {
    return await this.client.call(fm, params);
  }
}
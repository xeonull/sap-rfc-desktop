import noderfc from 'node-rfc';

export class NodeRFC {
  client;
  async open(options) {
    this.client = new noderfc.Client(options);
    await this.client.open();
  }
  async call(tab, opt) {
    return await this.client.call(tab, opt);
  }
}

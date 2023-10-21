import { ipcRenderer } from 'electron';

export default class {
  static getSystemCodes(): Promise<any> {
    return ipcRenderer.invoke('get-system-codes');
  }

  static getTableList(host: string): Promise<any> {
    return ipcRenderer.invoke('get-table-list', host);
  }

  static getTableContent(host: string, table_name: string, filter: string[]): Promise<any> {
    return ipcRenderer.invoke('get-table-content', host, table_name, filter);
  }

  static getTableFieldList(host: string, table_name: string): Promise<any> {
    return ipcRenderer.invoke('get-table-field-list', host, table_name);
  }
}

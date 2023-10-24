import { ipcRenderer } from 'electron';
import { store } from '@/store/store.js';

function spec(params: any) {
  params.delimeter = params.delimeter ?? ';';
  params.max_rows = params.max_rows ?? store.tableMaxRows;
  return params;
}

export default class {
  // Systems:
  static getSystemCodes(): Promise<any> {
    return ipcRenderer.invoke('get-system-codes');
  }
  // Tables:
  static getTableList(host: string): Promise<any> {
    return ipcRenderer.invoke('get-table-list', spec({ host }));
  }
  static getTableContent(host: string, tab: string, filter: string[]): Promise<any> {
    return ipcRenderer.invoke('get-table-content', spec({ host, tab, filter }));
  }
  static getTableFieldList(host: string, tab: string): Promise<any> {
    return ipcRenderer.invoke('get-table-field-list', spec({ host, tab }));
  }
  // Packages:
  static getPackage(host: string, appset: string, appl: string, package_name: string): Promise<any> {
    return ipcRenderer.invoke('get-package', spec({ host, appset, appl, package_name }));
  }
  static getPackageList(host: string): Promise<any> {
    return ipcRenderer.invoke('get-package-list', spec({ host }));
  }
  // Schedules:
  static getPlanStatusList(host: string): Promise<any> {
    return ipcRenderer.invoke('get-plan-status', spec({ host }));
  }
  static getSchedule(host: string, statuses: string[]): Promise<any> {
    return ipcRenderer.invoke('get-schedule', spec({ host, statuses }));
  }
  // Document:
  static getDocument(host: string, appset: string, doc_types: string[]): Promise<any> {
    return ipcRenderer.invoke('get-document', spec({ host, appset, doc_types }));
  }
  static getDocumentTypes(host: string): Promise<any> {
    return ipcRenderer.invoke('get-document-type', spec({ host }));
  }
  static getEnvironment(host: string): Promise<any> {
    return ipcRenderer.invoke('get-environment', spec({ host }));
  }
}

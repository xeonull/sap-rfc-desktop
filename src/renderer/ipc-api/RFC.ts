import { ipcRenderer } from 'electron';
import { store } from '@/store/store.js';
import { toRaw } from 'vue';

function spec(params: any) {
  params.delimeter = params.delimeter ?? ';';
  params.max_rows = params.max_rows ?? store.tableMaxRows;
  return params;
}

export default class {
  static SYS_MAX_ROW = 999999;
  // Systems:
  static getSystemCodes(): Promise<any> {
    return ipcRenderer.invoke('get-system-codes');
  }
  // Tables:
  static getTableList(host: string): Promise<any> {
    return ipcRenderer.invoke('get-table-list', spec({ host, max_rows: this.SYS_MAX_ROW }));
  }
  static getTableContent(host: string, tab: string, filter: string[]): Promise<any> {
    return ipcRenderer.invoke('get-table-content', spec({ host, tab, filter }));
  }
  static getTableFieldList(host: string, tab: string): Promise<any> {
    return ipcRenderer.invoke('get-table-field-list', spec({ host, tab, max_rows: this.SYS_MAX_ROW }));
  }
  // Packages:
  static getPackage(host: string, appset: string, appl: string, package_name: string): Promise<any> {
    return ipcRenderer.invoke('get-package', spec({ host, appset, appl, package_name }));
  }
  static getPackageList(host: string): Promise<any> {
    return ipcRenderer.invoke('get-package-list', spec({ host, max_rows: this.SYS_MAX_ROW }));
  }
  // Schedules:
  static getPlanStatusList(host: string): Promise<any> {
    return ipcRenderer.invoke('get-plan-status', spec({ host, max_rows: this.SYS_MAX_ROW }));
  }
  static getSchedule(host: string, statuses: string[]): Promise<any> {
    return ipcRenderer.invoke('get-schedule', spec({ host, statuses: toRaw(statuses) }));
  }
  // Document:
  static getDocument(host: string, appset: string, doc_types: string[]): Promise<any> {
    return ipcRenderer.invoke('get-document', spec({ host, appset, doc_types }));
  }
  static getDocumentTypes(host: string): Promise<any> {
    return ipcRenderer.invoke('get-document-type', spec({ host, max_rows: this.SYS_MAX_ROW }));
  }
  static getEnvironment(host: string): Promise<any> {
    return ipcRenderer.invoke('get-environment', spec({ host, max_rows: this.SYS_MAX_ROW }));
  }
}

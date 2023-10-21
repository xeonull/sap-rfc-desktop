import { ipcMain } from 'electron';
import sapSystemController from '../rfc/system.controller';
import sapTableController from '../rfc/table.controller';

export default () => {
  ipcMain.handle('get-system-codes', () => {
    return sapSystemController.getSystemCodes();
  });
  ipcMain.handle('get-table-list', (host) => {
    return sapTableController.getTableList(host);
  });
  ipcMain.handle('get-table-content', (host, table_name, filter) => {
    return sapTableController.getTableContent(host, table_name, filter);
  });
  ipcMain.handle('get-table-field-list', (host, table_name) => {
    return sapTableController.getFieldList(host, table_name);
  });
};

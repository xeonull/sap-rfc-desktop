import { ipcMain } from 'electron';
import sapSystemController from '../rfc/system.controller';
import sapTableController from '../rfc/table.controller';
import sapPackageController from '../rfc/package.controller';
import sapScheduleController from '../rfc/schedule.controller';
import sapDocumentController from '../rfc/document.controller';

export default () => {
  // Systems:
  ipcMain.handle('get-system-codes', () => {
    return sapSystemController.getSystemCodes();
  });
  // Tables:
  ipcMain.handle('get-table-list', async (event, params) => {
    return await sapTableController.getTableList(params);
  });
  ipcMain.handle('get-table-content', async (event, params) => {
    return await sapTableController.getTableContent(params);
  });
  ipcMain.handle('get-table-field-list', async (event, params) => {
    return await sapTableController.getFieldList(params);
  });
  // Packages:
  ipcMain.handle('get-package', async (event, params) => {
    return await sapPackageController.getPackageStatuses(params);
  });
  ipcMain.handle('get-package-list', async (event, params) => {
    return await sapPackageController.getPackages(params);
  });
  // Schedules:
  ipcMain.handle('get-plan-status', async (event, params) => {
    return await sapScheduleController.getPlanStatuses(params);
  });
  ipcMain.handle('get-schedule', async (event, params) => {
    return await sapScheduleController.getSchedule(params);
  });
  // Document:
  ipcMain.handle('get-document', async (event, params) => {
    return await sapDocumentController.getDocuments(params);
  });
  ipcMain.handle('get-document-type', async (event, params) => {
    return await sapDocumentController.getDocumentTypeList(params);
  });
  ipcMain.handle('get-environment', async (event, params) => {
    return await sapDocumentController.getEnvironments(params);
  });
};

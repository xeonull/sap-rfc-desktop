import { SapBaseController } from './base.controller.js';
import { normalizeSapTable, normalizeSapTableList } from '../utils/normalize.js';

class SapTableController extends SapBaseController {
  /* Get content of sap table*/
  getTableContent = async (host, tab, filter, delimeter, max_rows) => {
    let headers = [];
    const content = await this.pullTableData(host, tab, headers, filter, delimeter, max_rows);
    const table_and_fields = normalizeSapTable(content);
    return table_and_fields;
  };

  /* Get list with names of all transparent tables in sap system*/
  getTableList = async (host, delimeter, max_rows) => {
    const content = await this.pullTableData(host, 'DD02L', ['TABNAME'], ["TABCLASS EQ 'TRANSP'"], delimeter, max_rows);
    const list = normalizeSapTableList(content);
    return list;
  };

  /* Get list with fields of transparent table in sap system*/
  getFieldList = async (host, tab, delimeter, max_rows) => {
    const content = await this.pullTableData(host, 'DD03L', ['FIELDNAME', 'POSITION', 'LENG'], [`TABNAME EQ '${tab}'`], delimeter, max_rows);
    let { table } = normalizeSapTable(content);
    // Оставляем только поля, по которым можно фильтровать таблицу:
    table = table.filter((e) => e.LENG !== '000000');
    // Сортируем с учетом заданного в системе порядка:
    table.sort((a, b) => a.POSITION - b.POSITION);
    return table;
  };
}

export default new SapTableController();

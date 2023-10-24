import { SapBaseController } from './base.controller.js';
import { normalizeSapTable, normalizeSapTableList } from '../utils/normalize.js';

class SapTableController extends SapBaseController {
  /* Get content of sap table*/
  getTableContent = async (params) => {
    let headers = [];
    const content = await this.pullTableData(params.host, params.tab, headers, params.filter, params.delimeter, params.max_rows);
    const table_and_fields = normalizeSapTable(content);
    return table_and_fields;
  };

  /* Get list with names of all transparent tables in sap system*/
  getTableList = async (params) => {
    try {
      const content = await this.pullTableData(params.host, 'DD02L', ['TABNAME'], ["TABCLASS EQ 'TRANSP'"], params.delimeter, params.max_rows);
      const list = normalizeSapTableList(content);
      return list;
    } catch (e) {
      // return ['TABLE001', 'TABLE002', 'TABLE008', 'TABLE041', 'TABLE099', 'TABLE628', 'TABLE952'];
      this.throwRFCError(e);
    }
  };

  /* Get list with fields of transparent table in sap system*/
  getFieldList = async (params) => {
    const content = await this.pullTableData(
      params.host,
      'DD03L',
      ['FIELDNAME', 'POSITION', 'LENG'],
      [`TABNAME EQ '${tab}'`],
      params.delimeter,
      params.max_rows
    );
    let { table } = normalizeSapTable(content);
    // Оставляем только поля, по которым можно фильтровать таблицу:
    table = table.filter((e) => e.LENG !== '000000');
    // Сортируем с учетом заданного в системе порядка:
    table.sort((a, b) => a.POSITION - b.POSITION);
    return table;
  };
}

export default new SapTableController();

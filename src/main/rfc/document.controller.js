import { SapBaseController } from "./base.controller.js";
import { normalizeSapTable, normalizeSapTableList } from "../utils/normalize.js";
import { UTC_to_local } from "../utils/datetime.js";

class SapDocumentController extends SapBaseController {
  constructor() {
    super();
    this.docTypes = [];
    this.docTypes.push({ id: "DT001", value: "Script Logic", path: "%\\ADMINAPP\\%" });
    this.docTypes.push({ id: "DT002", value: "Form", path: "%\\EEXCEL\\%" });
    this.docTypes.push({ id: "DT003", value: "Transformation file", path: "%\\DATAMANAGER\\TRANSFORMATIONFILES\\%" });
    this.docTypes.push({ id: "DT004", value: "Conversion file", path: "%\\DATAMANAGER\\CONVERSIONFILES\\%" });
    this.docTypes.push({ id: "DT005", value: "Data file", path: "%\\DATAMANAGER\\DATAFILES\\%" });
    this.docTypes.push({ id: "DT006", value: "User log", path: "%\\PRIVATEPUBLICATIONS\\%" });
  }
  /* Get table with all environments in the system*/
  getEnvironments = async (req, res) => {
    try {
      let host = req.query.host;
      let delimeter = req.query.delimeter;
      let max_rows = req.query.max_rows;
      const content = await this.pullTableData(host, "UJA_APPSET_INFO", ["APPSET_ID"], [], delimeter, max_rows);
      const list = normalizeSapTableList(content);
      this.sendWithCode(list, res);
    } catch (error) {
      this.sendWithCode(error, res);
    }
  };
  /* Get list with available document types*/
  getDocumentTypeList = async (req, res) => {
    try {
      const list = this.docTypes.map((e) => {
        return { id: e.id, title: e.value };
      });
      this.sendWithCode(list, res);
    } catch (error) {
      this.sendWithCode(error, res);
    }
  };
  /* Get table with documents for the environment*/
  getDocuments = async (req, res) => {
    try {
      let host = req.query.host;
      let appset = req.query.appset;
      let delimeter = req.query.delimeter;
      let max_rows = req.query.max_rows;
      let doc_types = req.query.doc_types;
      const doc_filter = [];

      // console.log('doc_types:', doc_types);

      if (this.docTypes && doc_types) {
        this.docTypes.forEach((e) => {
          if (doc_types.indexOf(e.id) > -1) {
            doc_filter.push(`DOCNAME LIKE '${e.path}' OR `);
          }
        });
      }
      // Если doc_filter, то берем все типы
      if (doc_filter.length > 0) {
        doc_filter[0] = `AND ( ${doc_filter[0]}`;
        doc_filter[doc_filter.length - 1] = doc_filter[doc_filter.length - 1].replace("OR ", ")");
      }

      // console.log('doc_filter:', ...doc_filter);
      // const tab_filter = [`APPSET EQ '${appset}'`];
      // if (doc_filter.length > 0) {
      //   tab_filter.push(...doc_filter);
      // }
      // console.log('tab_filter:', tab_filter);
      const content = await this.pullTableData(
        host,
        "UJF_DOC",
        ["DOCDESC", "OWNER", "CREATE_DATE", "CREATE_TIME", "LSTMOD_DATE", "LSTMOD_TIME", "LSTMOD_USER"],
        [`APPSET EQ '${appset}'`, ...doc_filter],
        delimeter,
        max_rows
      );
      const { table } = normalizeSapTable(content, true);

      // Список полей конечной таблицы:
      const fields = [
        { key: "DOCUMENT", title: "Document", align: "start" },
        { key: "LSTMOD_USER", title: "Last Modification by", align: "start" },
        { key: "LSTMOD_DATE_TIME", title: "Last Modification Date", align: "start" },
        { key: "OWNER", title: "Created by", align: "start" },
        { key: "CREATE_DATE_TIME", title: "Create Date", align: "start" },
        { key: "DOCDESC", title: "Path", align: "start" },
      ];

      // Список полей из запроса, которые не требуются в конечной таблицы:
      const fields_del = ["CREATE_DATE", "CREATE_TIME", "LSTMOD_DATE", "LSTMOD_TIME"];

      table.forEach((row) => {
        // Корректируем формат дат:
        row.CREATE_DATE_TIME = UTC_to_local(row.CREATE_DATE, row.CREATE_TIME);
        row.LSTMOD_DATE_TIME = UTC_to_local(row.LSTMOD_DATE, row.LSTMOD_TIME);
        const path = row.DOCDESC.split("\\");
        row.DOCUMENT = path.at(-1);
        fields_del.forEach((fld) => delete row[fld]);
      });

      this.sendWithCode({ table, fields }, res);
    } catch (error) {
      console.log("error", error);
      this.sendWithCode(error, res);
    }
  };
}

export default new SapDocumentController();

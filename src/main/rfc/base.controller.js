// import noderfc from 'node-rfc';
import { rfcWebService } from "../container";

const DEFAULT_MAX_ROWS = 1000000;
const DEFAULT_DELIMETER = ';';

export class SapBaseController {
  throwRFCError(error) {
    if (error) {
      if (error.name === 'RfcLibError') {
        const err = new Error(`SAP NW RFC Error`);
        err.name = 'RFCLibError';
        err.codeString = 'ERR_RFC';
        throw err;
      }
    }
    throw error;
  }

  sendWithCode(content, res) {
    if (content && (content.name === 'ABAPError' || content.name === 'RfcLibError' || content.name === 'WebServerError')) {
      switch (content.key) {
        case 'NOT_AUTHORIZED':
          res.status(403).send(content);
          break;
        case 'TABLE_NOT_AVAILABLE':
          res.status(406).send(content);
          break;
        case 'RFC_INVALID_PARAMETER':
          res.status(406).send(content);
          break;
        default:
          res.status(400).send(content);
          break;
      }
    } else {
      res.send(content);
    }
  }
  sendError(error, res) {
    res.status(400).send(error);
  }

  async pullDomainValues(system_host, domain, lang = 'E', delimeter = DEFAULT_DELIMETER, max_rows = DEFAULT_MAX_ROWS) {
    const content = await this.pullTableData(
      system_host,
      'DD07T',
      ['DDTEXT', 'DOMVALUE_L'],
      [`DOMNAME EQ '${domain}' AND DDLANGUAGE EQ '${lang}'`],
      delimeter,
      max_rows
    );
    const o = {};
    content?.ET_DATA.forEach((row) => {
      const line = row.LINE.split(content.DELIMITER);
      if (line && line[0] && line[1]) o[line[1]] = line[0];
    });

    return o;
  }

  async pullTableData(system_host, table_name, headers = [], filter = [], delimeter = DEFAULT_DELIMETER, max_rows = DEFAULT_MAX_ROWS) {
    // const client = new noderfc.Client({ DEST: system_host });
    max_rows = parseInt(max_rows);

    await rfcWebService.open({ DEST: system_host });

    const rowskips = 0;
    const options = [];
    const fields = [];

    if (filter instanceof Array)
      filter.forEach((line) => {
        options.push({ TEXT: line });
      });

    if (headers instanceof Array)
      headers.forEach((f) => {
        fields.push({ FIELDNAME: f });
      });

    const result = await rfcWebService.call('RFC_READ_TABLE', {
      QUERY_TABLE: table_name,
      OPTIONS: options,
      USE_ET_DATA_4_RETURN: 'X',
      FIELDS: fields,
      ROWSKIPS: rowskips,
      DELIMITER: delimeter,
      ROWCOUNT: max_rows,
    });
    return result;
  }
}

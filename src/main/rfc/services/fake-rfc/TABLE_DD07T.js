export default {
  ET_DATA: [{ LINE: 'schedule;0' }, { LINE: 'ready;1' }, { LINE: 'finish;2' }, { LINE: 'disabled;3' }, { LINE: 'norun;4' }],
  DELIMITER: ';',
  GET_SORTED: '',
  NO_DATA: '',
  QUERY_TABLE: 'DD07T',
  ROWCOUNT: 999999,
  ROWSKIPS: 0,
  USE_ET_DATA_4_RETURN: 'X',
  FIELDS: [
    {
      FIELDNAME: 'DDTEXT',
      OFFSET: '000000',
      LENGTH: '000060',
      TYPE: 'C',
      FIELDTEXT: '',
    },
    {
      FIELDNAME: 'DOMVALUE_L',
      OFFSET: '000061',
      LENGTH: '000010',
      TYPE: 'C',
      FIELDTEXT: '',
    },
  ],
  OPTIONS: [{ TEXT: "DOMNAME EQ 'UJ_PLAN_STATUS' AND DDLANGUAGE EQ 'E'" }],
};

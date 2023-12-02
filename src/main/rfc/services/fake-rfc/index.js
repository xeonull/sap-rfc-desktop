import DATA_DD02L from './TABLE_DD02L';
import DATA_DD03L from './TABLE_DD03L';
import DATA_DD07T from './TABLE_DD07T';
import DATA_UJ0_PLAN from './TABLE_UJ0_PLAN';
import DATA_UJ0_SCHEDULE from './TABLE_UJ0_SCHEDULE';
import DATA_UJA_APPL from './TABLE_UJA_APPL';
import DATA_UJA_APPSET_INFO from './TABLE_UJA_APPSET_INFO';
import DATA_UJD_PACKAGES2 from './TABLE_UJD_PACKAGES2';
import DATA_UJD_STATUS from './TABLE_UJD_STATUS';
import DATA_UJD_STATUS_empty from './TABLE_UJD_STATUS_empty';
import DATA_UJF_DOC from './TABLE_UJF_DOC';

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class FakeRFC {
  client;

  async open(clientConfig) {
    this.client = {};
    this.client.options = clientConfig;
  }

  async call(fm, params) {
    await timeout(500);
    // console.log('OPTIONS:', params.OPTIONS);
    // Depending on the table name return example table data
    return {
      DD02L: DATA_DD02L,
      DD03L: DATA_DD03L,
      DD07T: DATA_DD07T,
      UJ0_PLAN: DATA_UJ0_PLAN,
      UJ0_SCHEDULE: DATA_UJ0_SCHEDULE,
      UJA_APPL: DATA_UJA_APPL,
      UJA_APPSET_INFO: DATA_UJA_APPSET_INFO,
      UJD_PACKAGES2: DATA_UJD_PACKAGES2,
      UJD_STATUS: params.OPTIONS.length === 0 || params.OPTIONS[0]?.TEXT === "PACKAGE_ID EQ 'Account Transformation'" ? DATA_UJD_STATUS : DATA_UJD_STATUS_empty,
      UJF_DOC: DATA_UJF_DOC,
    }[params.QUERY_TABLE];
  }
}

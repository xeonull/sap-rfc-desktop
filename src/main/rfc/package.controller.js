import { SapBaseController } from "./base.controller.js";
import { normalizeSapTable } from "../utils/normalize.js";
import { UTC_to_local, timestamp_to_datetime } from "../utils/datetime.js";

class SapPackageController extends SapBaseController {
  /* Get table with all packages in system*/
  getPackages = async (req, res) => {
    try {
      let host = req.query.host;
      let delimeter = req.query.delimeter;
      let max_rows = req.query.max_rows;
      const content = await this.pullTableData(
        host,
        "UJD_PACKAGES2",
        ["APPSET_ID", "APP_ID", "PACKAGE_ID", "GROUP_ID", "TEAM_ID"],
        ["PACKAGE_ID NE ''"],
        delimeter,
        max_rows
      );
      const table_and_fields = normalizeSapTable(content);
      this.sendWithCode(table_and_fields, res);
    } catch (error) {
      this.sendWithCode(error, res);
    }
  };
  /* Get table with package statuses*/
  getPackageStatuses = async (req, res) => {
    try {
      let host = req.query.host;
      let packageName = req.query.package;
      let appset = req.query.appset;
      let appl = req.query.appl;
      let delimeter = req.query.delimeter;
      let max_rows = req.query.max_rows;
      const content = await this.pullTableData(
        host,
        "UJD_STATUS",
        ["USER_ID", "STATUS", "TIMESTAMP", "TIMESTAMP_END", "PACKAGE_ID"],
        ["PACKAGE_ID EQ '" + packageName + "' ", "AND APPLICATION_ID EQ '" + appl + "'", "AND APPSET_ID EQ '" + appset + "'"],
        delimeter,
        max_rows
      );
      const { table, fields } = normalizeSapTable(content, true);
      [fields[0], fields[4]] = [fields[4], fields[0]]; // Меняем местами колонки 0 и 4:
      fields.push({ title: "Duration", align: "start", key: "DURATION" });
      [fields[5], fields[4]] = [fields[4], fields[5]]; // Меняем местами колонки 4 и 5:
      fields[0].title = "Package";
      fields[1].title = "Status";
      fields[2].title = "Time Start";
      fields[3].title = "Time End";
      fields[5].title = "User";

      table.forEach((e) => {
        // Корректируем формат дат:
        let datetime = timestamp_to_datetime(e.TIMESTAMP);
        e.TIMESTAMP = UTC_to_local(datetime.date, datetime.time);
        datetime = timestamp_to_datetime(e.TIMESTAMP_END);
        e.TIMESTAMP_END = UTC_to_local(datetime.date, datetime.time);
        // Подставляем описания стаутсов (в системе нет корректного соответствия кодов и описаний):
        switch (e.STATUS) {
          case "0":
            e.STATUS = "Running";
            break;
          case "1":
            e.STATUS = "Succeeded";
            break;
          case "2":
            e.STATUS = "Warning";
            break;
          case "3":
            e.STATUS = "Failed";
            break;
          case "4":
            e.STATUS = "Abort";
            break;
          default:
            e.STATUS = "Unknown";
            break;
        }
        // Расчитываем продолжительность:
        const diff = new Date(e.TIMESTAMP_END) - new Date(e.TIMESTAMP);
        const days = Math.trunc(diff / (1000 * 60 * 60 * 24));
        let day_prefix = "";
        if (days > 0) day_prefix = `${days}d `;
        e.DURATION = day_prefix + new Date(diff).toLocaleTimeString("ru", { timeZone: "UTC" });
      });
      this.sendWithCode({ table, fields }, res);
    } catch (error) {
      this.sendWithCode(error, res);
    }
  };
}

export default new SapPackageController();

import * as fs from 'fs';
import { join } from 'path';
import { app } from 'electron';

class SapSystemController {
  getSystemCodes = () => {
    const sys_list = [];
    const filePath = join(process.cwd(), 'sapnwrfc.ini');
    const data = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const lines = data.split('\n');
    lines.forEach((line) => {
      if (line.startsWith('DEST=')) {
        sys_list.push(line.slice(5).trim());
      }
    });

    return sys_list;
  };
}

export default new SapSystemController();

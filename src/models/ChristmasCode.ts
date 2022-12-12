import database from '../database';
import Weapon from './Item';
import { randomBytes } from 'crypto'

export class ChristmasCode {
  id: number;

  login_code: string;

  constructor(data: any) {
    this.id = data.id;

    this.login_code = data.login_code;
  }

  static getByCode(login_code: number): Promise<ChristmasCode | null> {
    return new Promise((resolve) => {
      database.query("SELECT * FROM christmas_login_codes WHERE login_code = ?", [login_code], (err, res) => {
        if (err) resolve(null);

        resolve(res[0]);
      });
    });
  }

  static createChristmasCode(christmas_code: string): Promise<boolean> {
    return new Promise((resolve) => {
      database.query("INSERT INTO `christmas_login_codes` (`login_code`) VALUES (?)", [christmas_code], (err, res) => {
        if (err) {
          resolve(false);
        }

        resolve(true);
      });
    });
  }
}

export default ChristmasCode;
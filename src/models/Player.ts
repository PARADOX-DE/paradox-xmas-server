import database from '../database';
import Weapon from './Item';

export class Account {
  id: number;

  name: string;
  password: string;
  salt: string;

  hasGiftClaimed: boolean;
  giftClaimed: string;

  christmasCode: string;

  constructor(data: any) {
    if(data.id) {
      this.id = data.id;

      this.name = data.Name;
      this.password = data.Pass;
      this.salt = data.Salt;

      this.hasGiftClaimed = false;
      this.giftClaimed = "";

      this.christmasCode = "";
    }
  }

  static getByUsername(username: string): Promise<Account | boolean> {
    return new Promise((resolve) => {
      try {
        database.query("SELECT * FROM player WHERE Name = ?", [username], (err, res) => {
          if (err) {
            resolve(false);
            return;
          }

          if (typeof res[0] === 'undefined' || res[0] === null) {
            resolve(false);
            return;
          }

          if (res[0] && res[0].id)
            resolve(new Account(res[0]));
          else resolve(false);
        });
      }catch { resolve(false); }
    });
  }
}

export default Account;
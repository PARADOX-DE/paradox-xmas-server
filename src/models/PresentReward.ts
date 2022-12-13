import database from '../database';
import Weapon from './Item';

export class PresentReward {
  id: number;

  item_id: number;
  amount: number;

  datetime: Date;

  constructor(data: any) {
    this.id = data.id;

    this.item_id = data.item_id;
    this.amount = data.item_amount;

    this.datetime = data.datetime;
  }

  static getCurrent(player_id: number): Promise<PresentReward | null> {
    return new Promise((resolve) => {
      database.query("SELECT * FROM log_present_reward WHERE player_id = ? AND datetime >= CURDATE() AND datetime < CURDATE() + INTERVAL 1 DAY", [player_id], (err: any, res: any) => {
        if (err) resolve(null);

        if (res && res.length > 0)
          resolve(res[0]);
        else resolve(null);
      });
    });
  }

  static getCurrentByChristmasCode(christmas_code: string): Promise<PresentReward | null> {
    return new Promise((resolve) => {
      database.query("SELECT * FROM log_present_reward WHERE christmas_code = ? AND datetime >= CURDATE() AND datetime < CURDATE() + INTERVAL 1 DAY", [christmas_code], (err: any, res: any) => {
        if (err) resolve(null);

        if (res && res.length > 0)
          resolve(res[0]);
        else resolve(null);
      });
    });
  }

  static addReward(player_id: number, item_id: number, amount: number, christmas_code: string): Promise<void> {
    return new Promise((resolve) => {
      database.query("INSERT INTO `log_present_reward` (`player_id`, `used_item_id`, `item_id`, `item_amount`, `christmas_code`) VALUES (?, 1, ?, ?, ?)", [player_id, item_id, amount, christmas_code], (err: any, res: any) => {
        if (err) {
          console.log(err);

          resolve(null);
        }
        
        resolve(res);
      });
    });
  }
}

export default PresentReward;
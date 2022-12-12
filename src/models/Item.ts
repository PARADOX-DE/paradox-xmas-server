import database from '../database';

export class Item {
  id: number;

  name: string;

  constructor(data: any) {
    this.id = data.id;

    this.name = data.name;
  }

  static getById(id: number): Promise<Item | null> {
    return new Promise((resolve) => {
      database.query("SELECT * FROM items_gd WHERE id = ?", [id], (err, res) => {
        if (err) {
          resolve(null);
        }

        resolve(new Item(res[0]));
      });
    });
  }
}

export default Item;
import express from "express";
import database from '../database';
import utils from '../utils';
import presents from '../assets/present-chances.json';
import Item from "../models/Item";
import PresentReward from "../models/PresentReward";

const router = express.Router();

router.get("/open", utils.authenticateJWT, async (req: any, res) => {
  new Promise(async () => {
    var presentReward = null;
    
    if(req.user.account.christmasCode != "") presentReward = await PresentReward.getCurrent(req.user.account.christmasCode);
    else presentReward = await PresentReward.getCurrent(req.user.account.id);

    if (presentReward != null) res.send({ success: false, content: "Du hast heute bereits ein Geschenk geöffnet!" });

    var fishedPresents = presents.filter(p => p.gift_id == 1197);
    var targetPresent = fishedPresents[
      Math.floor(
        Math.random() * fishedPresents.length
      )
    ];

    const item = await Item.getById(targetPresent.item_id);
    if (item == null) res.send({ success: false, content: "Fehler beim Öffnen!" });

    PresentReward.addReward(req.user.account.id, item.id, targetPresent.amount, req.user.account.christmasCode);

    return res.send({
      success: true, content: {
        item: (targetPresent.amount > 1 ? targetPresent.amount + "x " : "") + item.name,
        amount: targetPresent.amount
      }
    });
  });
});

export default router;
import express from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sha256 } from 'js-sha256';
import { jwtKey } from '../utils';
import Account from '../models/Player';
import PresentReward from "../models/PresentReward";
import ChristmasCode from "../models/ChristmasCode";
import Item from "../models/Item";
import { randomBytes } from "crypto";

const router = express.Router();

function comparePassword(password: string, hash: string) {
  return password == sha256(hash);
}

router.post("/check", (req, res) => {
  const { accessToken } = req.body;

  jwt.verify(accessToken, jwtKey, async (err: any, payload: any) => {
    if (err) return res.send({ success: false, content: null });
    const account = payload.account;
    var presentReward: PresentReward = null;

    if(account.christmasCode != "") presentReward = await PresentReward.getCurrentByChristmasCode(account.christmasCode);
    else presentReward = await PresentReward.getCurrent(account.id);

    if (presentReward != null) {
      const item = await Item.getById(presentReward.item_id);
      if (item == null) return;

      account.giftClaimed = item.name;
      account.hasGiftClaimed = true;
    }

    res.send({
      success: true,
      accessToken: accessToken,
      content: account,
    });
  });
});

router.get("/generate/code", async (req, res) => {
  const christmasCode = randomBytes(8).toString('hex');
  
  const christmasCodeResult = await ChristmasCode.createChristmasCode(christmasCode);
  if(christmasCodeResult == false) return res.send({ success: false, content: "Leider konnte dir kein Login-Code zugewiesen werden!" });
  else return res.send({ success: true, content: christmasCode });
});

router.post("/login/code", async (req, res) => {
  const { christmasCode } = req.body;

  const christmasLoginCode = await ChristmasCode.getByCode(christmasCode);
  if (christmasLoginCode == null) {
    res.send({ success: false, content: "Dein Login-Code wurde nicht gefunden!" });
  } else {
    const account = new Account({
      id: 1,
      Name: "Nutzer via Code",
      Pass: "", Salt: "",
    });

    account.christmasCode = christmasLoginCode.login_code;
    
    const accessToken = jwt.sign({ account }, jwtKey, { expiresIn: "2d" });
    const presentReward = await PresentReward.getCurrentByChristmasCode(account.christmasCode);

    if (presentReward != null) {
      const item = await Item.getById(presentReward.item_id);
      if (item == null) return;

      account.giftClaimed = item.name;
      account.hasGiftClaimed = true;
    }

    res.send({
      success: true,
      accessToken: accessToken,
      content: account,
    });
  }
});


router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const account = await Account.getByUsername(username);
  if (typeof account == "boolean") {
    res.send({ success: false, content: "Bitte melden Sie diesen Fehler der Entwicklung!" });
  } else {
    if (account == null) return res.send({ success: false, content: "Falscher Benutzername!" });
    if (username != account.name) return res.send({ success: false, content: "Falscher Benutzername!" });
    if (!comparePassword(account.password, (account.salt + sha256(password)))) return res.send({ success: false, content: "Falsches Passwort!" });

    const accessToken = jwt.sign({ account }, jwtKey, { expiresIn: "2d" });
    const presentReward = await PresentReward.getCurrent(account.id);

    if (presentReward != null) {
      const item = await Item.getById(presentReward.item_id);
      if (item == null) return;

      account.giftClaimed = item.name;
      account.hasGiftClaimed = true;
    }

    res.send({
      success: true,
      accessToken: accessToken,
      content: account,
    });
  }
});

export default router;
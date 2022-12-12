import jwt from 'jsonwebtoken';

export const jwtKey = "Vudihanadoheviruwijyjiligeromogydydegasekityvohopokojezonigezijolopipabelafexogifigifenemoxoxuhewafikekucijovozokacusugotihivodyxyxesyravuxucifaderebobidewilufufipiqonobamejodolizunececodazeravidapisaxofejiputapymumowifubyquwavumyqyjegugyfidahesobokusefob.";
export const authenticateJWT = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, jwtKey, (err: any, user: any) => {
      if (err) return res.sendStatus(403);

      req.user = user;
      next();
    });
  } else res.sendStatus(401);

};

export default { authenticateJWT, jwtKey };
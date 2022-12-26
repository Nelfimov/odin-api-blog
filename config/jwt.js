import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Issue JSONWebToken
 * @param {shape} user User object
 * @return {shape} returns token
 */
export function issueJWT(user) {
  const id = user.id;
  const expiresIn = '1d';

  const payload = {
    sub: id,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn});

  return {
    token: 'Bearer ' + signedToken,
    expires: expiresIn,
  };
};

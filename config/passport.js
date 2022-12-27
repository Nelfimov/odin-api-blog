import passport from 'passport';
import Strategy from 'passport-jwt';
import User from '../models/user.js';
import * as dotenv from 'dotenv';

dotenv.config();

const JwtStrategy = Strategy.Strategy;
const ExtractJwt = Strategy.ExtractJwt;
const customPassport = passport;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true,
};

customPassport.use(new JwtStrategy(opts, (req, payload, done) => {
  User.findById(payload.sub, (err, user) => {
    if (err) return done(err, false);

    if (user) {
      req.user = user;
      return done(null, user);
    };

    return done(null, false);
  });
}));

export default customPassport;

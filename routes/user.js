import {Router as router} from 'express';
import passport from '../config/passport.js';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import {issueJWT} from '../config/jwt.js';
import async from 'async';

const customRouter = router();

customRouter.get(
    '/protected',
    passport.authenticate('jwt', {session: false}),
    (req, res, next) => {
      res.status(200).json({message: 'You are authorized', user: req.user});
    },
);

customRouter.post('/login', (req, res, next) => {
  const {username, password} = req.body;

  User.findOne({username}, (err, user) => {
    if (err) return next(err);

    if (!user) {
      return res.json({message: 'No such user found'});
    };

    bcrypt.compare(password, user.password, (err, success) => {
      if (err) return next(err);

      if (success) {
        const jwt = issueJWT(user);

        return res.json({
          message: 'Success, you are logged in',
          token: jwt.token,
          user,
          expiresIn: jwt.expires,
        });
      };

      return res.json({message: 'Password is incorrect'});
    });
  });
});

customRouter.post('/register', (req, res, next) => {
  const {password, username, email} = req.body;

  async.parallel({
    username(callback) {
      User.find({username: username}).exec(callback);
    },
    email(callback) {
      User.find({email: email}).exec(callback);
    },
  }, (err, result) => {
    if (err) return next(err);

    if (!!result.username.length || !!result.email.length) {
      return res.json({message: 'This username or email is already taken'});
    };

    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) return next(err);

      const user = new User({
        username, email, password: hashedPassword,
      });

      await user.save();
      const jwt = issueJWT(user);

      return res.json({
        message: 'Success, new user registered. You can now log in',
        user: user,
        token: jwt.token,
        expiresIn: jwt.expires,
      });
    });
  });
});

export default customRouter;

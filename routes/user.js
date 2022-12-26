import {Router as router} from 'express';
import passport from '../config/passport.js';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import {issueJWT} from '../config/jwt.js';

const customRouter = router();

customRouter.post('/login', passport.authenticate('jwt', {session: false}));

customRouter.post('/register', (req, res, next) => {
  const {password} = req.body;
  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    if (err) return next(err);

    const {username, email} = req.body;

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

export default customRouter;

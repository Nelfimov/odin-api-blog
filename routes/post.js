/* eslint-disable no-unused-vars */
import {Router as router} from 'express';
import async from 'async';
import passport from '../config/passport.js';
import Post from '../models/post.js';
import Comment from '../models/comment.js';
import User from '../models/user.js';

const customRouter = router();

customRouter.get('/', (req, res, next) => {
  Post.find({})
      .populate('author', 'username')
      .lean()
      .exec((err, posts) => {
        if (err) return next(err);

        res.json(posts);
      });
}).post(
    '/',
    passport.authenticate('jwt', {session: false}),
    (req, res, next) => {
      if (!req.user.admin) {
        res.status(401).json({success: false, message: 'You are not admin'});
      };

      const {title, text} = req.body;

      const post = new Post({
        title,
        text,
        author: req.user});

      post.save((err) => {
        if (err) return next(err);

        res.json({
          success: true,
          message: 'Success, new post saved',
          post,
        });
      });
    },
);

customRouter.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
      .populate('author', 'username')
      .lean()
      .exec((err, result) => {
        if (err) return next(err);

        if (!result) {
          return res.json({
            success: false,
            message: 'Post not found under this ID',
          });
        };

        res.json(result);
      });
});

customRouter.get('/:postID/comments', (req, res, next) => {
  Comment.find({post: req.params.postID})
      .populate('author', 'username')
      .populate('post', 'title')
      .lean()
      .exec((err, comments) => {
        if (err) return next(err);

        if (!comments) {
          return res.json({
            success: false,
            message: 'No comments for this post found',
          });
        }

        res.json(comments);
      });
}).post(
    '/:postID/comments',
    passport.authenticate('jwt', {session: false}),
    (req, res, next) => {
      const {text} = req.body;

      console.log(req.user);

      const comment = new Comment({
        text, author: req.user, post: req.params.postID,
      });

      comment.save((err) => {
        if (err) return next(err);

        res.json({success: true, comment});
      });
    },
);

customRouter.get('/:postID/comments/:commentID', (req, res, next) => {
  async.parallel(
      {
        post(callback) {
          Post.findById(req.params.postID).exec(callback);
        },
        comment(callback) {
          Comment.findById(req.params.commentID)
              .populate('author', 'username')
              .populate('post', 'title')
              .lean()
              .exec(callback);
        },
      },
      (err, results) => {
        if (err) return next(err);

        const {post, comment} = results;

        if (!post) {
          return res.json({
            success: false,
            message: 'No such post',
          });
        };

        if (!comment) {
          return res.json({
            success: false,
            message: 'No such comment',
          });
        };

        return res.json({success: true, comment});
      },
  );
});

export default customRouter;

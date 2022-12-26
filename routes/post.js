import {Router as router} from 'express';
import async from 'async';

import Post from '../models/post.js';
import Comment from '../models/comment.js';

const customRouter = router();

customRouter.get('/', (req, res, next) => {
  Post.find({}, (err, posts) => {
    if (err) return next(err);

    res.json(posts);
  });
});

customRouter.get('/:id', (req, res, next) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) return next(err);

    if (!post) {
      return res.json({message: 'Post not found under this ID'});
    };

    res.json(post);
  });
});

customRouter.get('/:postID/comments', (req, res, next) => {
  Comment.find({post: req.params.postID}, (err, comments) => {
    if (err) return next(err);

    if (!comments) {
      return res.json({message: 'No comments for this post found'});
    }

    res.json(comments);
  });
});

customRouter.get('/:postID/comments/:commentID', (req, res, next) => {
  async.parallel(
      {
        post(callback) {
          Post.findById(req.params.postID).exec(callback);
        },
        comment(callback) {
          Comment.findById(req.params.commentID).exec(callback);
        },
      },
      (err, results) => {
        if (err) return next(err);

        const {post, comment} = results;

        if (!post) {
          return res.json({message: 'No such post'});
        };

        if (!comment) {
          return res.json({message: 'No such comment'});
        };

        return res.json(comment);
      },
  );
});

export default customRouter;

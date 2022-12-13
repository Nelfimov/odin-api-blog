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

// асинхронно запустить поиск поста и комментов через async
customRouter.get('/:id', (req, res, next) => {
  Post.findOne({id: req.params.id}, (err, post) => {
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
  });
});

export default customRouter;

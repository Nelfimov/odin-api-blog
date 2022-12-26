#! /usr/bin/env node
/* eslint-disable no-unused-vars */

// Get arguments passed on command line
import {series, parallel} from 'async';
import mongoose, {connect} from 'mongoose';

import * as dotenv from 'dotenv';
dotenv.config();

import Comment from './models/comment.js';
import Post from './models/post.js';
import User from './models/user.js';

connect(process.env.MONGODB_URL);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const posts = [];
const comments = [];
const users = [];

const userCreate = (email, username, password, cb) => {
  const user = new User({
    email, username, password,
  });

  user.save((err) => {
    if (err) {
      cb(err, null);
      return;
    };

    console.log('New user: ' + user);
    users.push(user);
    cb(null, user);
  });
};

const postCreate = (title, text, author, publish, cb) => {
  const post = new Post({
    title, text, author, publish,
  });

  post.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New post: ' + post);
    posts.push(post);
    cb(null, post);
  });
};

const commentCreate = (author, text, post, cb) => {
  const comment = new Comment({author, text, post});

  comment.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New comment: ' + comment);
    comments.push(comment);
    cb(null, comment);
  });
};

const createUsers = (cb) => {
  series([
    (callback) => userCreate(
        'example1@example.ru',
        'examplePost',
        'password1',
        callback,
    ),
    (callback) => userCreate(
        'example2@example.ru',
        'exampleComment1',
        'password2',
        callback,
    ),
    (callback) => userCreate(
        'example3@example.ru',
        'exampleComment2',
        'password3',
        callback,
    ),
  ], cb);
};

const createPosts = (cb) => {
  series([
    (callback) => postCreate(
        'How to build a website',
        'This is how to build a website by yourself',
        users[0],
        true,
        callback,
    ),
    (callback) => postCreate(
        'Raspberry Pi and you',
        'What can be done at home with your Pi',
        users[0],
        false,
        callback,
    ),
  ], cb);
};

const createComments = (cb) => {
  parallel([
    (callback) => commentCreate(
        users[1],
        'This is great post',
        posts[0],
        callback,
    ),
    (callback) => commentCreate(
        users[1],
        'Great!',
        posts[0],
        callback,
    ),
  ], cb);
};

series([
  createUsers,
  createPosts,
  createComments,
], (err, results) => {
  if (err) {
    console.log('FINAL ERR: ' + err);
  } else {
    console.log('ITEM Instances: ' + results);
  }
  mongoose.connection.close();
});

import {model, Schema} from 'mongoose';

const CommentSchema = new Schema({
  author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  text: {type: String, required: true},
  post: {type: Schema.Types.ObjectId, ref: 'Post', required: true},
  date: {type: Date, required: true, default: new Date()},
});

const Comment = model('Comment', CommentSchema);

export default Comment;

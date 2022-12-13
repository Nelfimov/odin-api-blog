import {model, Schema} from 'mongoose';

const PostSchema = new Schema({
  title: {type: String, required: true},
  text: {type: String, required: true},
  author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  date: {type: Date, required: true, default: new Date()},
  publish: {type: Boolean, default: false},
});

const Post = model('Post', PostSchema);

export default Post;

import mongoose from 'mongoose'
require('dotenv').config();
const options = {
  keepAlive: 1,
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
//Define a schema
const VideoSchema = new mongoose.Schema({
  page_url: String,
  name: String,
  downloadUrlList: [],
  time: Date,
  tagList: [],
  type: String
});
const Video = mongoose.model('Video', VideoSchema);
mongoose.connect(process.env.MONGODB_URL, options).then(() => console.log('DB connected'));

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
export default Video;

import mongoose from 'mongoose';

const connectedDb = (url) => {
  console.log('connect');
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
export default connectedDb;

import mongoose from "mongoose";

export const connect = () => {
  mongoose.connect(process.env.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
},
mongoose.set('strictQuery', false))
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));
};

import mongoose from 'mongoose';

export const initMongoConnection = async () => {
  try {
    const dbUri = process.env.MONGODB_URL;
    // await mongoose.connect(dbUri, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });
    // console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

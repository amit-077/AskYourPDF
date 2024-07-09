import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connected = await mongoose.connect(process.env.MONGO_URI!);
    if (connected) {
      console.log("Database connected");
    }
  } catch (e) {
    console.log(e);
  }
};

export default connectDB;

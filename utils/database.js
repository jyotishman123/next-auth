import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongoDB is already conneted");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbname: "share_prompt",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

      isConnected = true;
  } catch (error) {
    console.log(error)
  }
};

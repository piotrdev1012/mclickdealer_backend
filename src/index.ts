import app from "./config/express";
import { connectDB } from "./config/mongoose";
import routes from "./routes/routes";
import express from "express";
import path from "path";


const PORT: number = parseInt(process.env.PORT as string, 10);
async function main() {
  try {
    await connectDB();

    // Other code that depends on MongoDB
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
  }
}

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  console.log(process.env.MONGODB_URI);
  main()
    .then(() => {
      app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
      routes(app);
    })
    .catch((err) => {
      console.log(err);
    });
});

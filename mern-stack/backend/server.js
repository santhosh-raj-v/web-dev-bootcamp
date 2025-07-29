import express from "express";

import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Product from "./models/product.model.js";
const port = 5000;
const app = express();

dotenv.config();

app.use(express.json()); // allows us to accept JSON data in the req.body
app.get("/", (req, res) =>
  res.json({
    status: 200,
    message: "Server is up and running",
    MONGO_URI: process.env.MONGO_URI,
  })
);

app.post("/products", async (req, res) => {
  console.log(req.body);
  const prodcut = req.body;

  if (!prodcut.name || !prodcut.price || !prodcut.image) {
    return res
      .status(400)
      .json({ success: false, message: "please provide all the fields" });
  }

  const createProduct = await Product(prodcut);
  try {
    await createProduct.save();
    res.status(201).json({ data: createProduct });
  } catch (error) {
    console.error("Error while creating Product", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(port, () => {
  connectDB();
  console.log(`Server started at port  ${port}`);
});

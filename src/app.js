import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";

//IMPORT MULTER
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

//DATABASE
import connectDB from "./config/db";
//IMPORT ROUTES
import authRoutes from "./routes/auth.routes";
//INIT APP
const app = express();
app.use(express.json());
dotenv.config();
connectDB();

//CONFIG
app.set("port", process.env.PORT || 4000);

//MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json());

//MULTER CONFIG
const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/images"),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/ /g, "")}`);
  },
});

app.use(
  multer({
    storage,
    fileFilter(req, file, cb) {
      cb(null, true);
    },
  }).array("image")
);

//ROUTES
app.use("/api/auth", authRoutes);

//PUBLIC
app.use(express.static("public"));

export default app;

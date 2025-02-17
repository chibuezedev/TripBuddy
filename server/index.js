import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { Configuration, OpenAIApi } from "openai";

/* ROUTES IMPORTS */
import aiRoutes from "./routes/ai.js";
import authRoutes from "./routes/auth.js";
import connection from "./configs/db.js";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

/* OPEN AI CONFIGURATION */
const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
});
export const openai = new OpenAIApi(configuration);

/* ROUTES */
app.use("/secure/api/openai", aiRoutes);
app.use("/secure/api/auth", authRoutes);

/* SERVER SETUP */
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
  connection()
});

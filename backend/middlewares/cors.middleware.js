import cors from "cors";
import dotenv from "dotenv";

dotenv.config({path: ".env"});

const corsOptions = {
  origin: [
    "http://localhost:3000",
  ],
  credentials: true,
  methods: "POST, OPTIONS, GET, PUT, DELETE, PATCH",
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "user_id",
    "username",
  ],
  exposedHeaders: [
    "user_id",
    "username",
  ],
  optionsSuccessStatus: 200,
};

export const customCORS = cors(corsOptions);

import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`
=========================================
🚀 Deployment Engine Started

Port : ${PORT}

Status : Running
=========================================
`);
});

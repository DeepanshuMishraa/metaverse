import express from "express";
import { rootrouter } from "./routes/v1";

const app = express();
app.use("/api/v1",rootrouter);



app.listen(3000,()=>{
    console.log("Server is running on 3000")
})

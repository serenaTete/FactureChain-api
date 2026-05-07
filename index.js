import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import anomalieRoutes from "./routes/anomalie.routes.js";
import consommationRoutes from "./routes/consommation.routes.js";
import factureRoutes from "./routes/facture.routes.js";
import simulationRoutes from "./routes/simulationRoutes.js";
import testimonialRoutes from "./routes/testimonial.routes.js";
import reportRoutes from "./routes/report.routes.js";
import verifyRoutes from "./routes/verification.routes.js";
import runSimulation from "./services/simulationService.js"
import {initSocket} from "./sockets/socket.js";
import {startBilling} from "./cron/facture.cron.js";
import authRoutes from "./wallet.auth.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/consommations", consommationRoutes);
app.use("/api/factures", factureRoutes);
app.use("/api/simulation", simulationRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/meters", verifyRoutes);

app.get("/api", (req, res) => {
  res.send("FactureChain API running 🚀");
});

startBilling();
setInterval(() => {
  runSimulation();
}, 5000);


const server = http.createServer(app);
const io = initSocket(server);

export {io};

server.listen(3000, ()=>{
  console.log("Server running on port 3000");
});
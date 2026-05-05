// controllers/simulationController.js
import { runSimulation } from "../services/simulationService.js";

export const simulate = async (req, res) => {
  try {
    const result = await runSimulation(req.body);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
// controllers/anomalieController.js
import * as service from "../services/anomalieService.js";

export const listAnomalies = async (req, res) => {
  try {
    const data = await service.getAnomalies(req.query);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getOneAnomalie = async (req, res) => {
  try {
    const data = await service.getAnomalieById(req.params.id);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const removeAnomalie = async (req, res) => {
  try {
    await service.deleteAnomalie(req.params.id);
    res.json({ message: "Anomalie supprimée" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const resolveAnomalie = async (req, res) => {
  try {
    const data = await service.markAsResolved(req.params.id);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

import * as service from "../services/facture.services.js";

export const createFacture = async (req, res) => {
  try {
     const {meterId, year, month} = req.body;
    const facture = await service.generateMonthlyBills(
      meterId, year, month
    );
    res.json(facture);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const listFactures = async (req, res) => {
  try {
    const data = await service.getFactures();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
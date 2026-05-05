
import * as service from "../services/facturation.services.js";

export const createFacture = async (req, res) => {
  try {
    const facture = await service.genererFacture(
      req.params.consommationId
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
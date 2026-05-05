import * as service from "../services/report.service.js";

/**
 * 🟢 créer réclamation
 */
export const create = async (req, res) => {
  const data = await service.createReclamation(
    req.body.userId,
    req.body.message,
    req.body.factureId
  );

  res.json(data);
};

/**
 * 📊 voir toutes réclamations user
 */
export const getUser = async (req, res) => {
  const data = await service.getUserReclamations(req.params.userId);
  res.json(data);
};

/**
 * 🔎 détail
 */
export const getOne = async (req, res) => {
  const data = await service.getReclamationById(req.params.id);
  res.json(data);
};

/**
 * 🟡 traiter réclamation (admin)
 */
export const process = async (req, res) => {
  const result = await service.processReclamation(
    req.body.id,
    req.body.status,
    req.body.resolution,
    req.body.factureId,
    req.body.newAmount
  );

  res.json(result);
};
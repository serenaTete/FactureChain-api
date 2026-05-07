import * as service from "../services/verification.services.js";

export const verify = async (req, res) => {
  res.json(await service.verify(req.body));
};
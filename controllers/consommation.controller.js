import * as service from "../services/consommation.query.service.js";


/**
 * 🔴 temps réel
 */
export const realtime = async (req, res) => {
  res.json(await service.getRealtime(req.params.userId));
};

/**
 * 📅 jour
 */
export const daily = async (req, res) => {
  res.json(await service.getDaily(
    req.params.userId,
    req.query.date
  ));
};

/**
 * 📆 mois
 */
export const monthly = async (req, res) => {
  res.json(await service.getMonthly(
    req.params.userId,
    req.query.year,
    req.query.month
  ));
};

/**
 * 📈 année
 */
export const yearly = async (req, res) => {
  res.json(await service.getYearly(
    req.params.userId,
    req.query.year
  ));
};
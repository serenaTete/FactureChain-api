import * as service from "../services/report.service.js";

/**
 * 🟢 créer réclamation
 */
export const create = async (req, res) => {
try {

   const data = await service.createReclamation(
   req.body
  );

  res.json(data);
} catch(e){
  res.status(500).json({error: e.message})
}
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
 try{

  const result = await service.processReclamation(
 
    req.params.id,
    req.body.action

  );
   res.json(result);
 } catch(e){

  res.status(500).json({ error: e.message});
 }

 
};
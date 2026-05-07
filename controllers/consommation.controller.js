import {getHistory} from "../services/consommation.query.services.js";


export const history = async (req, res) =>{
try{

    const result = await getHistory({
        meterId: req.query.meterId,
        period: req.query.period,
        date: req.query.date,
        year: Number(req.query.year),
        month: Number(req.query.month)
    });

    res.json(result);
}catch (err){
    res.status(400).json({error: err.message});
}
};



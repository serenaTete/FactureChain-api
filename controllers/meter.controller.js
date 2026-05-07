import {getMetersByUser, createMeter, assignMeter, unassignMeter } from  "../services/meter.services.js";

export const create = async(req, res)=>{

    const meter = await createMeter(req.body.name);
    res.json(meter);
}

export const assign = async(req, res)=>{

    const {meterId, userId} = req.body;
    const result = await assignMeter(meterId, userId);
    res.json(result);
}

export const unassign = async(req, res)=>{

  const {meterId} = req.body;
    const result = await unassignMeter(meterId);
    res.json(result);
}

export const meters = async(req, res)=>{

    const address = req.params;
    const data = await getMetersByUser(address);
    res.json(data);
}
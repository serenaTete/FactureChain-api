import {getMetersByUser, createMeter, assignMeter, unassignMeter } from  "../services/meter.services.js";

export const create = async(req, res)=>{

    const meter = await createMeter(req.body.name);
    res.json(meter);
}

export const assign = async(req, res)=>{

    const {meterId, userId} = req.body;
    const result
}

export const create = async(req, res)=>{

    const meter = await createMeter(req.body.name);
    res.json(meter);
}

export const create = async(req, res)=>{

    const meter = await createMeter(req.body.name);
    res.json(meter);
}
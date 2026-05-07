import prisma from "../utils/prisma.js";
import {hashData} from "../utils/hash.js"


export const getMetersByUser = async(address) => {

    return await prisma.User.findUnique({

        where: {address},
        include: {
            meters: true
        }
    });
}

export const createMeter = async(numero)=>{

    return await prisma.Compteur.create({
        data:{
            numero,
            status: "AVAILABLE"
        }
    });

}

export const assignMeter = async( compteurId, userId) =>{

    return await prisma.Compteur.update({
        where: {id: compteurId},
        data:{
            userId,
            status: "ASSIGNED"
        }
    })
}

export const unassignMeter = async(compteurId)=>{

    return await prisma.Compteur.update({
        where: {id: compteurId},
        data:{
            userId: null,
            status: "AVAILABLE"
        }
    })

}

export const getAssignedMeters = async()=>{

    return await prisma.Compteur.findMany({
        where: {
            userId: {not: null},
            status: "ASSIGNED"
        }
    })
}

export const add = async (userId, numero)=>{

    const meter= await prisma.Compteur.create({
        data:: {
            userId,
            numero
        }
    });
}

 


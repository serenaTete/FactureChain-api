import prisma from "../utils/prisma.js";

/**
 * 🔴 TEMPS RÉEL
 */

export const getHistory = async({
    meterId, 
    period,
    date, 
    year,
    month
}) =>{
    let start, end;
    const now = new Date();

    if(period === "today"){

        start = new Date();
        start.setHours(0,0,0,0);
        end= new Date();
        end.setHours(0,0,0,0);
    }

    else if(period ==="this_month"){
        start = new Date( now.getFullYear(), now.getMonth(), 1);

        end = new Date( now.getFullYear(), now.getMonth()+1, 0, 23, 59, 59, 999);
    }

    else if(period === "this_year"){
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    }

    else if(period = "daily"){

        start = new Date(date);
        start.setHours(0,0,0,0);

        end= new Date(date);
        end.setHours(23,59,59,9999);
    }

    else if (period === "monthly"){
        
        start = new Date(year, month - 1, 1);
        end = new Date(year, month, 0, 23, 59, 59, 999);


    }


     else if (period === "yearly"){
        
        start = new Date(year, 0, 1);
        end = new Date(year,11, 31, 23, 59, 59, 999);


    }

    else{
        throw new Error("Période invalide");
    }


    const consumptions = await prisma.consumption.findMany({
        where: {
           compteurId: meterId,
            date:{
                gte: start,
                lte: end
            }
        }, 
        orderBy: {
            date: "asc"
        }
    });

    const total = consumptions.reduce((sum, c) => sum + c.value, 0);

    const average = consumptions.length > 0 ? total / consumptions.length : 0 ;

    return {

        period,
        meterId,
        start,
        end,
        total, 
        average,
        count: consumptions.length,
        data: consumptions
    };
};




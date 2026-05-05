import prisma from "../utils/prisma.js";

export const getUserByAddress = async (address) => {

    return await prisma.User.findUnique({
        where: {address},
        include: {meters: true}
    })
}
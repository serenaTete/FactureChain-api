import prisma from "../utils/prisma.js";
import {ethers} from "ethers";
 import {generateNonce} from "../utils/nonce.util.js";
 import {generateToken} from "../utils/token.utils.js";

 export const getNonce = async(address) =>{

    let user = await prima.User.findUnique({
        where: {address}
    });

    if(!user){
        user= await prisma.User.create({data:
            {address,
                nonce: generateNonce()
            }
        });
    }else{
        user =await prisma.User.update({
            where: {address},
            data: {nonce: generateNonce()}
        });
    }
    return user.nonce;
 };

 export const verifySignature = async({address, signature}) =>{
    const user = await prisma.User.findUnique({
        where: {address}
    });

    if(!user) throw new Error("User not found");

    const message = `sign this message: ${user.nonce}`;
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if(recoveredAddress.toLowerCase() !== address.toLowerCase()){

        throw new Error("signature invalide");
    }

    await prisma.User.update({
        where: {address},
        data: {nonce: generateNonce()}
    });

    const token = generateToken(user);

    return {user, token};
 }
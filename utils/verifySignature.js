import {ethers} from "ethers";

export const verifySignature = (message, signature, address) => {
    const signer =
    ethers.verifyMessage(message, signature);
    return signer.toLowercase()=== address.toLowerCase();
}
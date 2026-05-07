export const generateNonce = () =>{
    return Math.floor(Math.Random() * 1000000).toString();
}
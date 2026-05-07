 import jwt from 'jsonwebtoken';
 
 

 export const generateToken = (user) =>{
    return jwt.sign(
        {
            id: user.id,
            address: user.address
        },
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    )
 }
import{ getNonce, verifySignature} from "../services/wallet.auth.service.js";


export const nonce = async(req, res) =>
{
    try{
        const address = req.body;
        const nonce = await getNonce(address);
        res.json({nonce});
    } catch(e){
        res.status(400).json({error: e.message});
    }
}

    export const login = async (req, res) => {

        try{

            const data= await verifySignature(req.body);
            res.json(data);
        }catch(e){
            res.status(400).json({error: e.message});
        }
    };

import  {Server} from "socket.io";
import {getUserByAddress} from "../services/user.services.js";

export const initSocket = (server)=>{

    const io = new Server(server, {
        cors: { origin: "*"}
    });

    io.on("connection", (socket)=>{
        console.log("Client connecté:", socket.id);

        socket.on("joinWallet", async({address}) =>{

            const user = getUserByaddress(adress);

            user.meters.foreach( meter => {
                socket.join(`meter_${meter.id}`)
            });

            console.log("Rooms rejointes :", user.meters.length);
        });
    });

    return io;
}
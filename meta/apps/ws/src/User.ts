import { WebSocket } from "ws";
import { RoomManager } from "./RoomManager";
import { OutgoingMessage } from "./types";

function genRandomString(length:number){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for(let i=0;i<characters.length;i++){
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

export class User {
    public id:string
  constructor(private ws: WebSocket) {
    this.id = genRandomString(10);
  }

  initHandlers() {
    this.ws.on("message", (data) => {
      const parsedData = JSON.parse(data.toString());

      switch (parsedData.type) {
        case "join":{
            const spaceId = parsedData.payload.spaceId
            RoomManager.addUser(spaceId,this)
        }
      }
    });
  }

  send(payload:OutgoingMessage){
    this.ws.send(JSON.stringify(payload))
  }
}

import { OutgoingMessage } from "./types";
import type { User } from "./User";

export class RoomManager {
  rooms: Map<string, User[]> = new Map();
  static instance: RoomManager;

  private constructor() {
    this.rooms = new Map();
  }

  static getInstance(){
    if(!this.instance){
        this.instance = new RoomManager();
    }

    return this.instance;
  }

  public addUser(spaceId:string,user:User){
    this.rooms.set(spaceId,[...(this.rooms.get(spaceId) ?? []),user])
  }

  public broadcast(message:OutgoingMessage,user:User,roomId:string){
    if(!this.rooms.has(roomId)){
        return;
    }
    
  }
}

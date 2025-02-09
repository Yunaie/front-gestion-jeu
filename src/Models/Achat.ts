import { GameDeposit } from "./GameDeposit";
import { jsPDF } from "jspdf";
import { Timestamp } from "firebase/firestore";

export class Achat {
    [x: string]: any;
    public id: string;
    public total: number;
    public jeuAacheter: GameDeposit[];
    public sessionId: string;
    public createdAt: Date | Timestamp;
    public pdfRecu?: string; 
    public userId : string;


    constructor(id: string, total: number, jeuAacheter: GameDeposit[], sessionId: string, userId: string,createdAt: Date | Timestamp = new Date()) {
        this.id = id;
        this.userId = userId;
        this.total = total;
        this.jeuAacheter = jeuAacheter;
        this.sessionId = sessionId;
        this.createdAt = createdAt;
        
    }

    
}



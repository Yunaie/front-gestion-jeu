import { GameDeposit } from "./GameDeposit";

export class Achat {
    [x: string]: any;
    public id: string;
    public total: number;
    public jeuAacheter: GameDeposit[];
    public sessionId: string;
    public createdAt: Date;

    constructor(id: string, total: number, jeuAacheter: GameDeposit[], sessionId: string, createdAt: Date = new Date()) {
        this.id = id;
        this.total = total;
        this.jeuAacheter = jeuAacheter;
        this.sessionId = sessionId;
        this.createdAt = createdAt;
    }
}

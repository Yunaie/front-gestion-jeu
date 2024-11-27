import { JeuDeposeService } from "../Services/JeuDeposeService";

export enum StatutRole {
    ouvert = 'ouvert',
    fermer = 'fermer'
}


export class Session {
    [x: string]: any;
    public id: string;
    public name: string;
    public statut: StatutRole;
    public dateDebut: Date;
    public dateFin: Date;
    public adminCreateurId: string;
    public frais: number;
    public commissionsPourcentages: number;
    public TotalSommeComissions: number ; 
    public TotalSommeFrais: number ; 

    constructor(
        name: string,
        id: string,
        adminCreateurId: string,
        dateDebut: Date,
        dateFin: Date,
        statut: StatutRole,
        frais: number,
        commissions: number
    ) {
        this.name = name;
        this.statut = statut;
        this.frais = frais;
        this.commissionsPourcentages = commissions;
        this.id = id;
        this.dateDebut = new Date(dateDebut);
        this.dateFin = new Date(dateFin);
        this.adminCreateurId = adminCreateurId;
        this.TotalSommeComissions = 0;
        this.TotalSommeFrais = 0;
    }
    
}


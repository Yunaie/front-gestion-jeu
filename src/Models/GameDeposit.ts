export enum EtatRole {
    mauvais = 'mauvais',
    bon = 'bon',
    parfait = 'parfait'
  }

  export enum StatutRoleGame {
    vente = 'en vente',
    vendu = 'vendu',
    retirerDelaVente = 'retiré de la vente'
  }

export class GameDeposit {
    public id: string;
    public name: string;
    public editeur: string;
    public etat: EtatRole;
    public statut: StatutRoleGame;
    public prix: number;
    public vendeurId: string;
    public sessionId : string | undefined;
    constructor(name: string, editeur: string, etat: EtatRole, statut: StatutRoleGame, prix: number, id: string,vendeurId: string,sessionId : string) {
        this.name = name;
        this.editeur = editeur;
        this.etat = etat;
        this.statut = statut;
        this.prix = prix;
        this.id = id;
        this.vendeurId = vendeurId;
        this.sessionId = sessionId;
    }

}

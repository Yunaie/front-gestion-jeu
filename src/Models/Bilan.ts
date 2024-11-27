export class Bilan {
    vendeurId: string;
    nomVendeur: string;
    totalVentes: number;
    fraisTotaux: number;
    soldeFinal: number;
    nombreJeuxVendus: number;
    nombreJeuxInvendus: number;
    ventesParPeriode: VenteParPeriode[];
    statutPaiement: 'payé' | 'en attente';
    historiquePaiements: Paiement[];
    dateBilan: Date;
  
    constructor(
      vendeurId: string,
      nomVendeur: string,
      totalVentes = 0,
      fraisTotaux = 0,
      soldeFinal = 0,
      nombreJeuxVendus = 0,
      nombreJeuxInvendus = 0,
      ventesParPeriode: VenteParPeriode[] = [],
      statutPaiement: 'payé' | 'en attente' = 'en attente',
      historiquePaiements: Paiement[] = [],
      dateBilan = new Date()
    ) {
      this.vendeurId = vendeurId;
      this.nomVendeur = nomVendeur;
      this.totalVentes = totalVentes;
      this.fraisTotaux = fraisTotaux;
      this.soldeFinal = soldeFinal;
      this.nombreJeuxVendus = nombreJeuxVendus;
      this.nombreJeuxInvendus = nombreJeuxInvendus;
      this.ventesParPeriode = ventesParPeriode;
      this.statutPaiement = statutPaiement;
      this.historiquePaiements = historiquePaiements;
      this.dateBilan = dateBilan;
    }
  }
  
  export class VenteParPeriode {
    periode: string;
    montantVentes: number;
    jeuxVendus: number;
  
    constructor(
      periode: string,
      montantVentes = 0,
      jeuxVendus = 0
    ) {
      this.periode = periode;
      this.montantVentes = montantVentes;
      this.jeuxVendus = jeuxVendus;
    }
  }
  
  export class Paiement {
    montant: number;
    datePaiement: Date;
    modePaiement: string;
  
    constructor(
      montant: number,
      datePaiement: Date = new Date(),
      modePaiement: string = 'virement bancaire'
    ) {
      this.montant = montant;
      this.datePaiement = datePaiement;
      this.modePaiement = modePaiement;
    }
  }
  
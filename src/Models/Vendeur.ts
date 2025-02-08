export class Vendeur {
    [x: string]: any;
    public id: string;
    public name: string;
    public firstname: string;
    public email: string | null;
    public phone: string | null;
    public fraisApayer: number;
    public totalFrais: number;
    public gain: number;
    public totalGain: number;
    public pdfRecu?: string;

    constructor(name: string, fraisApayer: number, firstname: string, email: string, id: string, phone: string, gain: number) {
        this.name = name;
        this.email = email;
        this.totalFrais = 0;
        this.totalGain = 0;
        this.firstname = firstname;
        this.phone = phone;
        this.id = id;
        this.fraisApayer = fraisApayer;
        this.gain = 0;
    }


}


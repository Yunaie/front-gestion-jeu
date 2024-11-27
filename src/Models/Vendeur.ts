export class Vendeur {
    [x: string]: any;
    public id: string;
    public name: string;
    public firstname: string;
    public email: string | null;
    public phone: string | null;
    public fraisApayer: number;
    public totalFrais : number;
    public gain: number;
    public totalGain: number;

    constructor(name: string,  fraisApayer: number, firstname: string, email: string, id: string, phone: string, gain: number) {
        this.name = name;
        this.totalFrais = 0;
        this.totalGain = 0;
        this.firstname = firstname;
        this.phone = phone;
        this.id = id;
        this.fraisApayer = fraisApayer;
        this.gain = 0;
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const frenchPhoneRegex = /^(?:\+33|0)[1-9](?:[ .-]?\d{2}){4}$/;


        if (!re.test(email)) {
            this.email = null;
        } else {
            this.email = email;
        }

        if (!frenchPhoneRegex.test(phone)) {
            this.phone = null;
        } else {
            this.phone = phone;
        }
    }


}


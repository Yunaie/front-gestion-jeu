
export class Acheteur {
    public id: string;
    public name: string;
    public firstname: string;
    public email: string ;
    public phone: string ;

    constructor(
        name: string,
        firstname: string,
        email: string,
        id: string,
        phone: string
    ) {
        this.name = name;
        this.firstname = firstname;
        this.id = id;
        this.phone = phone;
        this.email = email;
    }
}

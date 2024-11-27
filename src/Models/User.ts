export enum UserRole {
  Admin = 'admin',
  Gestionnaire = 'gestionnaire'
}

export class User {
  public id: string;
  public name: string;
  public firstname: string;
  public role: UserRole;
  public email: string | null;
  public phone: string;

  constructor(
    name: string,
    firstname: string,
    role: UserRole,
    email: string,
    id: string,
    phone: string
  ) {
    this.name = name;
    this.firstname = firstname;
    this.role = role;
    this.phone = phone;
    this.id = id;

    if (!this.validateEmail(email)) {
      this.email = null;
    } else {
      this.email = email;
    }
  }

  validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../Models/User';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, switchMap } from 'rxjs/operators';
import { Vendeur } from '../Models/Vendeur';
import { UserRole } from '../Models/User';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { SessionService } from './SessionService';
import { jsPDF } from "jspdf";
import { JeuDeposeService } from './JeuDeposeService';
import { firstValueFrom } from 'rxjs';
import { Acheteur } from '../Models/Acheteur';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: AngularFirestore, private JeuDeposeService: JeuDeposeService, private SessionService: SessionService, private afAuth: AngularFireAuth) { }

  //--------------------------- USER -------------------------------------


  getFireBaseUser(): Observable<User | null> {
    return this.afAuth.authState.pipe(
      map(firebaseUser => {
        if (firebaseUser) {
          const user = new User(
            firebaseUser.displayName ?? 'Unknown',
            'Unknown',
            UserRole.Gestionnaire,
            firebaseUser.email ?? '',
            firebaseUser.uid,
            ''
          );
          return user;
        } else {
          return null;
        }
      })
    );
  }




  getUserById(id: string): Observable<User | null> {
    return this.firestore.collection<User>('UsersGestion').doc(id).valueChanges().pipe(
      map(user => user ?? null)
    );
  }

  createUser(uid: string, email: string, firstname: string, tel: string, name: string): Promise<void> {

    return this.firestore.collection('UsersGestion').doc(uid).set({
      name: name,
      firstname: firstname,
      email: email,
      phone: tel,
      id: uid,
      role: UserRole.Gestionnaire,
      createdAt: new Date()
    });
  }

  userExistMail(email: string): Observable<boolean> {
    return this.firestore.collection<User>('UsersGestion', ref =>
      ref.where('email', '==', email).limit(1)
    ).valueChanges().pipe(
      map(users => users.length > 0)
    );
  }

  UserExistPhone(phone: string): Observable<boolean> {
    return this.firestore.collection<User>('UsersGestion', ref =>
      ref.where('phone', '==', phone).limit(1)
    ).valueChanges().pipe(
      map(users => users.length > 0)
    );
  }

  IsAdmin(user: User): boolean {
    return (user.role == UserRole.Admin)
  }



  //--------------------------- VENDEUR -------------------------------------


  modifyFraisVendeur(id: string, frais: number) {
    return this.firestore
      .collection("UserVendeur")
      .doc(id)
      .update({ fraisApayer: frais })
      .then(() => {
        console.log('Frais du vendeur mis à jour avec succès');
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour des frais du vendeur :', error);
      });
  }

  modifyTotalFraisVendeur(id: string, totalFrais: number) {
    return this.firestore
      .collection("UserVendeur")
      .doc(id)
      .update({ totalFrais: totalFrais })
      .then(() => {
        console.log('Total frais du vendeur mis à jour avec succès');
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour des frais du vendeur :', error);
      });
  }

  modifyTotalGainsVendeur(id: string, updatedVendeur: Partial<Vendeur>) {
    return this.firestore
      .collection("UserVendeur")
      .doc(id)
      .update(updatedVendeur)
      .then(() => {
        console.log(' Total gain du vendeur mis à jour avec succès');
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour des gains du vendeur :', error);
      });
  }



  modifyGainVendeur(id: string, updatedVendeur: Partial<Vendeur>) {
    return this.firestore
      .collection("UserVendeur")
      .doc(id)
      .update(updatedVendeur)
      .then(() => {
        console.log('Gain du vendeur mis à jour avec succès');
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour des gains du vendeur :', error);
      });
  }


  createVendeur(totalFrais: number, totalGain: number, email: string, firstname: string, phone: string, name: string, fraisApayer: number, gain: number): Promise<any> {
    const docRef = this.firestore.collection('UserVendeur').doc();
    const id = docRef.ref.id;

    return docRef.set({
      name: name,
      firstname: firstname,
      email: email,
      phone: phone,
      id: id,
      fraisApayer: fraisApayer,
      gain: gain,
      totalGain: totalGain,
      totalFrais: totalFrais,

      createdAt: new Date()
    }).then(() => {
      return { id };
    });
  }



  getVendeur(email: string, phone: string): Observable<Vendeur | undefined> {
    return this.firestore.collection<Vendeur>('UserVendeur', ref =>
      ref.where('email', '==', email).where('phone', '==', phone)
    ).valueChanges().pipe(
      map(vendeurs => {
        return vendeurs.length > 0 ? vendeurs[0] : undefined;
      })
    );
  }

  getVendeurById(id: string): Observable<Vendeur | undefined> {
    return this.firestore.collection<Vendeur>('UserVendeur').doc<Vendeur>(id).valueChanges();
  }

  VendeurExistMail(email: string): Observable<boolean> {
    return this.firestore.collection<Vendeur>('UserVendeur', ref =>
      ref.where('email', '==', email).limit(1)
    ).valueChanges().pipe(
      map(vendeurs => vendeurs.length > 0)
    );
  }


  VendeurExistPhone(phone: string): Observable<boolean> {
    return this.firestore.collection<Vendeur>('UserVendeur', ref =>
      ref.where('phone', '==', phone).limit(1)
    ).valueChanges().pipe(
      map(vendeurs => vendeurs.length > 0)
    );
  }


  getVendeurFrais(vendeurId: string): Observable<number> {
    return this.firestore.collection<Vendeur>('UserVendeur').doc(vendeurId).valueChanges().pipe(
      map(vendeur => {
        if (vendeur) {
          return vendeur.fraisApayer || 0;
        } else {
          return 0;
        }
      })
    );
  }

  getVendeurTotalFrais(vendeurId: string): Observable<number> {
    return this.firestore.collection<Vendeur>('UserVendeur').doc(vendeurId).valueChanges().pipe(
      map(vendeur => {
        if (vendeur) {
          return vendeur.totalFrais || 0;
        } else {
          return 0;
        }
      })
    );
  }

  getVendeurTotalGains(vendeurId: string): Observable<number> {
    return this.firestore.collection<Vendeur>('UserVendeur').doc(vendeurId).valueChanges().pipe(
      map(vendeur => {
        if (vendeur) {
          return vendeur.totalGain || 0;
        } else {
          return 0;
        }
      })
    );
  }

  validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }

  verifierFormatNumero(numero: string): boolean {

    const regex = /^(\+?\d{1,3})?[-.\s]?(\d{2,3})[-.\s]?(\d{2})[-.\s]?(\d{2})[-.\s]?(\d{2})$/;

    return regex.test(numero);
  }

  ouvrirRecuPDF(pdf: string): void {
    if (pdf) {
      window.open(pdf, "_blank");
    } else {
      console.error("Aucun PDF généré.");
    }
  }




  async genererPDFRecu(vendeur: Vendeur): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const doc = new jsPDF();

      let session = this.SessionService.getCurrentSession();
      if (!session) {
        console.error("❌ Problème de récupération de la session");
        reject("Erreur de récupération des données");
        return;
      }

      doc.setFontSize(16);
      doc.text("Bilan financier", 10, 10);
      doc.setFontSize(12);
      doc.text(`${vendeur.firstname} ${vendeur.name}`, 10, 20);
      doc.text(`Infos du vendeur : ${vendeur.phone} ${vendeur.email}`, 10, 30);
      doc.text(`Session : ${session.name} du ${session.dateDebut} au ${session.dateFin}`, 10, 40);
      doc.text(`Frais à payer : ${vendeur.fraisApayer} €`, 10, 50);
      doc.text(`Gains à récupérer : ${vendeur.gain} €`, 10, 60);
      doc.text(`Total de frais : ${vendeur.totalFrais} €`, 10, 70);
      doc.text(`Total de gains : ${vendeur.totalGain} €`, 10, 80);
      doc.text(`Solde final : ${vendeur.totalGain - vendeur.totalFrais} €`, 10, 90);

      try {
        const listeJeu = await firstValueFrom(this.JeuDeposeService.getJeuByVendeurId(vendeur.id));

        doc.text("Jeux déposés :", 10, 110);
        let y = 120;

        if (listeJeu && listeJeu.length > 0) {
          listeJeu.forEach((jeu, index) => {
            doc.text(`${index + 1}. ${jeu.name} ${jeu.editeur}  ${jeu.etat} ${jeu.statut} - ${jeu.prix}  €`, 10, y);
            y += 10;
          });
        } else {
          doc.text("Aucun jeu déposé.", 10, y);
        }

        const pdfUrl = doc.output("bloburl").toString();
        console.log("✅ PDF généré :", pdfUrl);
        resolve(pdfUrl);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des jeux :", error);
        reject("Erreur lors de la récupération des jeux");
      }
    });
  }




  async updatePdfRecu(achatId: string, vendeur: Partial<Vendeur>) {
    return this.firestore
      .collection("UserVendeur")
      .doc(achatId)
      .update(vendeur)
      .then(() => {
        console.log('vendeur modifiée avec succès');
      })
      .catch((error) => {
        console.error('Erreur lors de la modification du vendeur :', error);
      });
  }


  //--------------------------- ACHETEUR -------------------------------------
  createAcheteur(name: string, firstname: string, email: string, phone: string, idticket: string): Promise<any> {
    const docRef = this.firestore.collection('UserAcheteur').doc();
    const id = docRef.ref.id;

    return docRef.set({
      id: id, 
      name: name,
      firstname: firstname,
      email: email,
      phone: phone,
      ticket: idticket ? [idticket] : [], 
      createdAt: new Date()
    }).then(() => {
      return { id }; 
    }).catch(error => {
      console.error("❌ Erreur lors de la création de l'acheteur :", error);
      throw error;
    });
}


  getAcheteurById(id: string): Observable<Acheteur | undefined> {
    return this.firestore.collection<Acheteur>('UserAcheteur', ref =>
      ref.where('id', '==', id)
    ).valueChanges().pipe(
      map(acheteurs => {
        return acheteurs.length > 0 ? acheteurs[0] : undefined;
      })
    );
  }
  AcheteurExistMail(email: string): Observable<boolean> {
    return this.firestore.collection<Acheteur>('UserAcheteur', ref =>
      ref.where('email', '==', email).limit(1)
    ).valueChanges().pipe(
      map(acheteurs => acheteurs.length > 0)
    );
  }


  AcheteurExistPhone(phone: string): Observable<boolean> {
    return this.firestore.collection<Acheteur>('UserAcheteur', ref =>
      ref.where('phone', '==', phone).limit(1)
    ).valueChanges().pipe(
      map(acheteurs => acheteurs.length > 0)
    );
  }

  getAcheteur(email: string, phone: string): Observable<Acheteur | undefined> {
    return this.firestore.collection<Acheteur>('UserAcheteur', ref =>
      ref.where('email', '==', email).where('phone', '==', phone)
    ).valueChanges().pipe(
      map(acheteurs => {
        return acheteurs.length > 0 ? acheteurs[0] : undefined;
      })
    );
  }
  

  updateAcheteur(id: string, idticket: string) {
    this.getAcheteurById(id).subscribe(data => {
      if (!data) {
        console.error("Aucun acheteur trouvé avec cet ID.");
        return;
      }
  
      console.log("Acheteur récupéré :", data);
  
      const acheteur = { ...data, ticket: Array.isArray(data.ticket) ? [...data.ticket] : [] };
  
      if (!acheteur.ticket.includes(idticket)) {
        console.log("Ajout du ticket...");
        acheteur.ticket.push(idticket);
        console.log("Ticket ajouté localement, mise à jour Firebase...");
  
        this.firestore.collection('UserAcheteur').doc(id).update({
          ticket: acheteur.ticket
        }).then(() => {
          console.log("Ticket ajouté avec succès !");
        }).catch(error => {
          console.error("Erreur lors de la mise à jour :", error);
        });
      } else {
        console.log("Ce ticket est déjà enregistré pour cet acheteur.");
      }
    });
  }
  





}



import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../Models/User';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, switchMap } from 'rxjs/operators';
import { Vendeur } from '../Models/Vendeur';
import { UserRole } from '../Models/User';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) { }



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
  

  createVendeur(totalFrais : number, totalGain : number, email: string, firstname: string, phone: string, name: string, fraisApayer: number,gain : number): Promise<any> {
    const docRef = this.firestore.collection('UserVendeur').doc();
    const id = docRef.ref.id;

    return docRef.set({
      name: name,
      firstname: firstname,
      email: email,
      phone: phone,
      id: id,
      fraisApayer: fraisApayer,
      gain : gain ,
      totalGain :totalGain,
      totalFrais : totalFrais,

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



  IsAdmin(user: User): boolean {
    return (user.role == UserRole.Admin)
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
  

}

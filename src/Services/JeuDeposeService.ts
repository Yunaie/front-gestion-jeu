import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Vendeur } from '../Models/Vendeur';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { GameDeposit, StatutRoleGame } from '../Models/GameDeposit';
@Injectable({
  providedIn: 'root'
})
export class JeuDeposeService {

  constructor(private fireauth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) { }



  createJeu(name: string, editeur: string, etat: string, prix: number, statut: string, vendeurId: string, sessionId:string): Promise<any> {
    const docRef = this.firestore.collection('GameDeposit').doc();
    const id = docRef.ref.id;

    return docRef.set({
      name: name,
      editeur: editeur,
      etat: etat,
      prix: prix,
      id: id,
      statut: statut,
      vendeurId: vendeurId,
      sessionId : sessionId,
      createdAt: new Date()
    }).then(() => {
      return { id };
    });
  }

  getAllGames(): Observable<GameDeposit[]> {
    return this.firestore.collection<GameDeposit>('GameDeposit').valueChanges();
  }
  

  getJeu(name: string, editeur: string): Observable<Vendeur | undefined> {
    return this.firestore.collection<Vendeur>('GameDeposit', ref =>
      ref.where('name', '==', name).where('editeur', '==', editeur)
    ).valueChanges().pipe(
      map(GameDeposits => {
        return GameDeposits.length > 0 ? GameDeposits[0] : undefined;
      })
    );
  }

  getJeuById(id: string): Observable<GameDeposit | undefined> {
    return this.firestore.collection<GameDeposit>('GameDeposit').doc<GameDeposit>(id).valueChanges();
  }
  

  getJeuByVendeurId(vendeurId: string): Observable<GameDeposit[]> {
    return this.firestore.collection<GameDeposit>('GameDeposit', ref => ref.where('vendeurId', '==', vendeurId))
      .valueChanges();
  }

  changerStatut(id: string, nouveauStatut: StatutRoleGame): Promise<void> {
    const jeuRef = this.firestore.collection('GameDeposit').doc(id);

    return jeuRef.update({
      statut: nouveauStatut 
    }).then(() => {
      console.log(`Statut du jeu avec ID ${id} changé en ${nouveauStatut}`);
    }).catch((error) => {
      console.error("Erreur lors de la mise à jour du statut :", error);
    });
  }


  IsOnSale(jeu: GameDeposit): boolean {
    return (jeu.statut == StatutRoleGame.vente);
  }

  getNombreTotalJeuxByVendeur(vendeurId: string): Observable<number> {
    return this.firestore.collection('GameDeposit', ref => ref.where('vendeurId', '==', vendeurId))
      .valueChanges()
      .pipe(
        map(jeux => jeux.length)
      );
  }

  getNombreJeuxVendusByVendeur(vendeurId: string): Observable<number> {
    return this.firestore.collection('GameDeposit', ref =>
        ref.where('vendeurId', '==', vendeurId).where('statut', '==', 'vendu')
      )
      .valueChanges()
      .pipe(
        map(jeux => jeux.length)
      );
  }

  getNombreJeuxEnVenteByVendeur(vendeurId: string): Observable<number> {
    return this.firestore.collection('GameDeposit', ref =>
        ref.where('vendeurId', '==', vendeurId).where('statut', '==', 'en vente')
      )
      .valueChanges()
      .pipe(
        map(jeux => jeux.length)
      );
  }

  getNombreTotalJeuxBySession(sessionId: string): Observable<number> {
    return this.firestore
      .collection('GameDeposit', ref => ref.where('sessionId', '==', sessionId))
      .valueChanges()
      .pipe(
        map(jeux => jeux.length)
      );
  }
  
  getNombreJeuxVendusBySession(sessionId: string): Observable<number> {
    return this.firestore
      .collection('GameDeposit', ref =>
        ref.where('sessionId', '==', sessionId).where('statut', '==', 'vendu')
      )
      .valueChanges()
      .pipe(
        map(jeux => jeux.length)
      );
  }
  
  getNombreJeuxEnVenteBySession(sessionId: string): Observable<number> {
    return this.firestore
      .collection('GameDeposit', ref =>
        ref.where('sessionId', '==', sessionId).where('statut', '==', 'en vente')
      )
      .valueChanges()
      .pipe(
        map(jeux => jeux.length)
      );
  }
  
  


}
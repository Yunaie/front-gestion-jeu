import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Achat } from '../Models/Achat';
import { GameDeposit } from '../Models/GameDeposit';

@Injectable({
  providedIn: 'root'
})
export class AchatService {

  constructor(private firestore: AngularFirestore) {}

  // Création d'un nouvel achat
  createAchat(total: number, jeuxAacheter: GameDeposit[], sessionId: string): Promise<any> {
    const docRef = this.firestore.collection('Achats').doc();
    const id = docRef.ref.id;

    return docRef.set({
      id: id,
      total: total,
      jeuAacheter: jeuxAacheter,
      sessionId: sessionId,
      createdAt: new Date() // Enregistrement de la date et heure actuelles
    }).then(() => {
      return { id };
    });
  }

  // Récupération d'un achat par ID sans conversion
  getAchatById(id: string): Observable<Achat | undefined> {
    return this.firestore.collection<Achat>('Achats').doc<Achat>(id).valueChanges();
  }

  // Récupération des achats par session ID sans conversion
  getAchatsBySessionId(sessionId: string): Observable<Achat[]> {
    return this.firestore.collection<Achat>('Achats', ref => ref.where('sessionId', '==', sessionId))
      .valueChanges();
  }

  // Récupération des achats par vendeur ID sans conversion
  getAchatsByVendeurId(vendeurId: string): Observable<Achat[]> {
    return this.firestore.collection<Achat>('Achats', ref => ref.where('vendeurId', '==', vendeurId))
      .valueChanges();
  }
}

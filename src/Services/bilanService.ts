import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Bilan } from '../Models/Bilan';  // Assure-toi que le modèle Bilan est bien importé

@Injectable({
  providedIn: 'root'
})


export class BilanService {
  private bilansCollection: AngularFirestoreCollection<Bilan>;

  constructor(private firestore: AngularFirestore) {
    this.bilansCollection = this.firestore.collection<Bilan>('Bilans');  // Assure-toi que 'Bilans' est le nom de la collection dans Firestore
  }

  // Crée un nouveau bilan pour un vendeur
  createBilan(bilan: Bilan): Promise<void> {
    const id = this.firestore.createId();  // Génère un ID unique pour le bilan
    bilan.dateBilan = new Date();  // Assigne la date actuelle au bilan
    return this.bilansCollection.doc(id).set({ ...bilan });
  }

  // Récupère un bilan spécifique par son ID
  getBilanById(id: string): Observable<Bilan> {
    return this.bilansCollection.doc<Bilan>(id).valueChanges() as Observable<Bilan>;
  }

  // Met à jour un bilan existant
  updateBilan(id: string, updatedBilan: Partial<Bilan>): Promise<void> {
    return this.bilansCollection.doc(id).update(updatedBilan);
  }

  // Récupère tous les bilans
  getAllBilans(): Observable<Bilan[]> {
    return this.bilansCollection.valueChanges({ idField: 'id' });
  }

  // Supprime un bilan par son ID
  deleteBilan(id: string): Promise<void> {
    return this.bilansCollection.doc(id).delete();
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Bilan } from '../Models/Bilan';  

@Injectable({
  providedIn: 'root'
})


export class BilanService {
  private bilansCollection: AngularFirestoreCollection<Bilan>;

  constructor(private firestore: AngularFirestore) {
    this.bilansCollection = this.firestore.collection<Bilan>('Bilans');  
  }

  createBilan(bilan: Bilan): Promise<void> {
    const id = this.firestore.createId();  
    bilan.dateBilan = new Date();  
    return this.bilansCollection.doc(id).set({ ...bilan });
  }

  getBilanById(id: string): Observable<Bilan> {
    return this.bilansCollection.doc<Bilan>(id).valueChanges() as Observable<Bilan>;
  }

  updateBilan(id: string, updatedBilan: Partial<Bilan>): Promise<void> {
    return this.bilansCollection.doc(id).update(updatedBilan);
  }

  getAllBilans(): Observable<Bilan[]> {
    return this.bilansCollection.valueChanges({ idField: 'id' });
  }

  deleteBilan(id: string): Promise<void> {
    return this.bilansCollection.doc(id).delete();
  }
}

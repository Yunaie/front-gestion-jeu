import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Session } from '../Models/Session';
import { StatutRole } from '../Models/Session';

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    currentSession : Session | null = null;

    constructor(private firestore: AngularFirestore) { }

    setCurrentSession(session : Session) {
        this.currentSession = session;
    }

    getCurrentSession() : Session | null {
        return this.currentSession
    }

    clearCurrentSession() {
        this.currentSession = null;
    } 

    getAllSessions(): Observable<Session[]> {
        return this.firestore.collection<Session>('Sessions')
            .snapshotChanges()
            .pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Session;
                    data.id = a.payload.doc.id;
                    return data;
                }))
            );
    }

    getSessionById(id: string): Observable<Session | null> {
        return this.firestore.collection<Session>('Sessions').doc(id).valueChanges().pipe(
            map(session => session ?? null)
        );
    }

    getSessionsByAdminId(adminId: string): Observable<Session[]> {
        return this.firestore.collection<Session>('Sessions', ref => ref.where('adminCreateurId', '==', adminId))
            .snapshotChanges()
            .pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Session;
                    data.id = a.payload.doc.id;
                    return data;
                }))
            );
    }

    getOpenSession(): Observable<Session | undefined> {
        return this.firestore.collection<Session>('Sessions', ref => ref.where('statut', '==', 'ouverte'))
            .snapshotChanges()
            .pipe(
                map(actions => {
                    if (actions.length > 0) {
                        const data = actions[0].payload.doc.data() as Session;
                        data.id = actions[0].payload.doc.id;
                        return data;
                    } else {
                        return undefined;
                    }
                })
            );
    }

    createSession(
        name: string,
        statut: string,
        dateDebut: string,
        dateFin: string,
        adminCreateurId: string,
        frais: number,
        commissionsPourcentages: number,
        TotalSommeComissions: number,
        TotalSommeFrais: number): Promise<any> {

        const docRef = this.firestore.collection('Sessions').doc();
        const id = docRef.ref.id;
        
        return docRef.set({
            id: id,
            name: name,
            statut: statut,
            dateDebut: dateDebut,
            dateFin: dateFin,
            adminCreateurId: adminCreateurId,
            frais: frais,
            commissionsPourcentages: commissionsPourcentages,
            TotalSommeComissions : TotalSommeComissions,
            TotalSommeFrais:TotalSommeFrais,
       createdAt: new Date(),
     }).then(() => {
      return { id };
    });
  }

  IsOpen(session: Session): boolean {
    return (session.statut == StatutRole.ouvert);
  }

  modifySession(id: string, updatedSession: Partial<Session>) {
    return this.firestore
      .collection("Sessions")
      .doc(id)
      .update(updatedSession)
      .then(() => {
        console.log('Session modifiée avec succès');
      })
      .catch((error) => {
        console.error('Erreur lors de la modification de la session :', error);
      });
  }
}


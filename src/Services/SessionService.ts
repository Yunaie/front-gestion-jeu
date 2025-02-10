import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Session } from '../Models/Session';
import { StatutRole } from '../Models/Session';
import { jsPDF } from "jspdf";
import { Vendeur } from '../Models/Vendeur';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    currentSession: Session | null = null;

    constructor(private firestore: AngularFirestore) { }

    setCurrentSession(session: Session) {
        this.currentSession = session;
    }

    getCurrentSession(): Session | null {
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
            TotalSommeComissions: TotalSommeComissions,
            TotalSommeFrais: TotalSommeFrais,
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

    getTotalGainsBySession(idSession: string): Observable<number> {
        return this.firestore.collection<Vendeur>('UserVendeur', ref => 
            ref.where('idSession', '==', idSession)
        ).valueChanges().pipe(
          map(vendeurs => 
            vendeurs.reduce((total, vendeur) => total + (vendeur.gain || 0), 0)
          )
        );
    }
    
    getTotalFraisBySession(idSession: string): Observable<number> {
        return this.firestore.collection<Vendeur>('UserVendeur', ref => 
            ref.where('idSession', '==', idSession)
        ).valueChanges().pipe(
          map(vendeurs => 
            vendeurs.reduce((total, vendeur) => total + (vendeur.fraisApayer || 0), 0)
          )
        );
    }
    

     ouvrirRecuPDF(pdf: string): void {
        if (pdf) {
            window.open(pdf, "_blank");
        } else {
            console.error("Aucun PDF généré.");
        }
    }


    
    async genererPDFRecu(session: Session): Promise<string> {
        if (!this.IsOpen(session)) {
            console.error("❌ Cette session est fermée");
            throw new Error("Cette session est fermée.");
        }
    
        try {
            const gainArecup = await firstValueFrom(this.getTotalGainsBySession(session.id));
            const fraisArecup = await firstValueFrom(this.getTotalFraisBySession(session.id));
    
            const doc = new jsPDF();
            
            doc.setFontSize(16);
            doc.text("Bilan financier", 10, 10);
    
            doc.setFontSize(12);
            doc.text(`Session : ${session.name} du ${session.dateDebut} au ${session.dateFin}`, 10, 20);
            doc.text(`Frais en pourcentage : ${session.frais}%`, 10, 30);
            doc.text(`Commissions en pourcentage : ${session.commissionsPourcentages}%`, 10, 40);
    
            doc.text(`Gains à récupérer par les vendeurs : ${gainArecup} €`, 10, 50);
            doc.text(`Frais à payer par les vendeurs : ${fraisArecup} €`, 10, 60);
            doc.text(`Total des frais : ${session.TotalSommeFrais} €`, 10, 70);
            doc.text(`Total des commissions : ${session.TotalSommeComissions} €`, 10, 80);
    
            const soldeFinal = session.TotalSommeComissions + session.TotalSommeFrais;
            doc.text(`Solde final : ${soldeFinal} €`, 10, 90);
    
            const pdfUrl = doc.output("bloburl").toString();
            console.log("✅ PDF généré :", pdfUrl);
            return pdfUrl;
    
        } catch (error) {
            console.error("❌ Erreur lors de la génération du PDF :", error);
            throw new Error("Erreur lors de la génération du PDF.");
        }
    }
    





    async updatePdfRecu(sessionId: string, pdfUrl: string): Promise<void> {
        try {
            await this.firestore.collection("Sessions").doc(sessionId).update({
                bilan: pdfUrl
            });
            console.log(`✅ Bilan mis à jour avec succès pour la session "${sessionId}"`);
        } catch (error) {
            console.error(`❌ Erreur lors de la mise à jour du bilan pour la session "${sessionId}" :`, error);
        }
    }
    

}


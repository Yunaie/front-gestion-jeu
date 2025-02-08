import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Achat } from '../Models/Achat';
import { GameDeposit } from '../Models/GameDeposit';
import { jsPDF } from "jspdf";
import { Timestamp } from '@angular/fire/firestore';
import { SessionService } from './SessionService';
import { UserService } from './UserService';
import { doc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AchatService {

  constructor(private firestore: AngularFirestore, private SessionService: SessionService, private UserService: UserService) { }

  createAchat(total: number, jeuxAacheter: GameDeposit[], sessionId: string, userId: string): Promise<any> {
    const docRef = this.firestore.collection('Achats').doc();
    const id = docRef.ref.id;

    return docRef.set({
      id: id,
      total: total,
      jeuAacheter: jeuxAacheter,
      sessionId: sessionId,
      userId: userId,
      createdAt: new Date()
    }).then(() => {
      return { id };
    });
  }

  getAchatById(id: string): Observable<Achat | undefined> {
    return this.firestore.collection<Achat>('Achats').doc<Achat>(id).valueChanges();
  }

  getAchatsBySessionId(sessionId: string): Observable<Achat[]> {
    return this.firestore.collection<Achat>('Achats', ref => ref.where('sessionId', '==', sessionId))
      .valueChanges();
  }

  getAchatsByVendeurId(vendeurId: string): Observable<Achat[]> {
    return this.firestore.collection<Achat>('Achats', ref => ref.where('vendeurId', '==', vendeurId))
      .valueChanges();
  }

  ouvrirRecuPDF(pdf: string): void {
    if (pdf) {
      window.open(pdf, "_blank");
    } else {
      console.error("Aucun PDF généré.");
    }
  }




  genererPDFRecu(achat: Achat): Promise<string> {
    return new Promise((resolve, reject) => {
        const doc = new jsPDF();

        this.SessionService.getSessionById(achat.sessionId).subscribe(session => {
            this.UserService.getUserById(achat.userId).subscribe(user => {
                if (session && user) {
                    const dateAchat = achat.createdAt instanceof Date
                        ? achat.createdAt
                        : new Date(achat.createdAt.seconds * 1000);

                    const dateFormatee = dateAchat.toLocaleDateString();
                    const heureFormatee = dateAchat.toLocaleTimeString();

                    doc.setFontSize(16);
                    doc.text("Reçu d'Achat", 10, 10);
                    doc.setFontSize(12);
                    doc.text(`ID Achat : ${achat.id}`, 10, 20);
                    doc.text(`ID du vendeur : ${achat.userId}`, 10, 30);
                    doc.text(`Session : ${session.name} du ${session.dateDebut} au ${session.dateFin}`, 10, 40);
                    doc.text(`Date d'achat : ${dateFormatee} à ${heureFormatee}`, 10, 50);
                    doc.text(`Montant total : ${achat.total} €`, 10, 60);

                    doc.text("Jeux achetés :", 10, 80);
                    let y = 90;
                    achat.jeuAacheter.forEach((jeu, index) => {
                        doc.text(`${index + 1}. ${jeu.name} - ${jeu.prix} €`, 10, y);
                        y += 10;
                    });

                    const pdfUrl = doc.output("bloburl").toString();
                    console.log("✅ PDF généré :", pdfUrl);

                    resolve(pdfUrl); 

                } else {
                    console.error("❌ Problème de récupération des données");
                    reject("Erreur de récupération des données");
                }
            }, error => reject(error)); 
        }, error => reject(error)); 
    });
}




async updatePdfRecu(achatId: string, updatedAchat: Partial<Achat>) {
    return this.firestore
      .collection("Achats")
      .doc(achatId)
      .update(updatedAchat)
      .then(() => {
        console.log('Achat modifiée avec succès');
      })
      .catch((error) => {
        console.error('Erreur lors de la modification de lachat :', error);
      });
  }


}

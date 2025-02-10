import { Routes } from '@angular/router';
import { LoginComponent } from '../Components/login/login.component';
import { RegisterComponent } from '../Components/register/register.component';
import { DashboardComponent } from '../Components/dashboard/dashboard.component';
import { AppComponent } from './app.component';
import { DepotComponent } from '../Components/depot/depot.component';
import { AchatComponent } from '../Components/ajouter-achat/ajouter-achat.component';
import { EnregistrerVendeurComponent } from '../Components/register-vendeur/register-vendeur.component';
import { LoginVendeurComponent } from '../Components/login-vendeur/login-vendeur.component';
import { InfoVendeurComponent } from '../Components/info-vendeur/info-vendeur.component';
import { AdminSessionComponent } from '../Components/admin-session/admin-session.component';
import { AccueilUserComponent } from '../Components/accueil-user/accueil-user.component';
import { AfficherAchatComponent } from '../Components/afficher-achat/afficher-achat.component';
import { ListeJeuxComponent } from '../Components/liste-jeux/liste-jeux.component';
import { ModifierSessionComponent } from '../Components/modifier-session/modifier-session.component';
import { ChoixAdminComponent } from '../Components/choix-admin/choix-admin.component';
import { AdminAdminComponent } from '../Components/admin-admin/admin-admin.component';
import { LendingPageComponentComponent } from '../Components/lending-page-component/lending-page-component.component';

export const routes: Routes = [
    {path:"app", component:AppComponent},
    {path: 'login',component:LoginComponent},
    {path: 'register',component:RegisterComponent},
    {path: 'dashboard',component:DashboardComponent},
    {path: 'depot', component:DepotComponent},
    {path: 'registerVendeur', component:EnregistrerVendeurComponent},
    {path: 'achat', component:AchatComponent},
    {path:'loginVendeur',component:LoginVendeurComponent},
    {path:'infosVendeur', component:InfoVendeurComponent},
    {path: 'admin-session', component:AdminSessionComponent},
    {path: 'admin-choix', component:ChoixAdminComponent},
    {path: 'admin-admin', component:AdminAdminComponent},
    {path:'accueilGestionnaire',component:AccueilUserComponent},
    {path:'afficherAchat', component:AfficherAchatComponent},
    {path:'ListeJeux',component:ListeJeuxComponent},
    {path:'modifierSession',component:ModifierSessionComponent},
    {path:'',component:LendingPageComponentComponent}

    
];

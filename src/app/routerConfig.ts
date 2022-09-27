import { HomeComponent } from './home/home.component';
import { Routes } from '@angular/router';
import { PvmesComponent } from './pvmes/pvmes.component';

const appRoutes: Routes = [
    {
        path: 'pvmes',
        component: PvmesComponent
    },
    {
        path: 'home',
        component: HomeComponent
    }
];

export default appRoutes;
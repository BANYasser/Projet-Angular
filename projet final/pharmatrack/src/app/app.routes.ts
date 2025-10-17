import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Login } from './pages/login/login';
import { MedicineListComponent } from './pages/medicine-list/medicine-list';
import { MedicineFormComponent } from './pages/medicine-form/medicine-form';
import { authGuard } from './services/auth.guard';
import { adminGuard } from './services/admin.guard';
import { SalesList } from './pages/sales-list/sales-list';
import { SalesFormComponent } from './pages/sales-form/sales-form';
import { MainLayoutComponent } from './components/layouts/main-layout/main-layout';

export const routes: Routes = [
  { path: 'login', component: Login }, // Login SANS layout
  {
    path: '',
    canActivate: [authGuard],
    component: MainLayoutComponent, // Layout appliqué ici
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'medicines', component: MedicineListComponent },
      { path: 'sales', component: SalesList },
      { path: 'sales/new', component: SalesFormComponent, canActivate: [authGuard] },
      { path: 'medicines/new', component: MedicineFormComponent, canActivate: [adminGuard] },
      { path: 'medicines/edit/:id', component: MedicineFormComponent, canActivate: [adminGuard] },
      { path: 'sales/edit/:id', component: SalesFormComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: '' }
];

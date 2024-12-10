import { Routes } from '@angular/router';
import { AuthGuardServiceService } from './auth-guard-service.service';
import { CustomersComponent } from './customers/customers.component';
import { HomeComponent } from './home/home.component';
import { NotAccessPageComponent } from './not-access-page/not-access-page.component';
import { ProductsComponent } from './products/products.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'products', component: ProductsComponent, canActivate: [AuthGuardServiceService] },
    { path: 'customers', component: CustomersComponent },
    { path: '', redirectTo: 'home', pathMatch: "full" },
    { path: '**', component: NotAccessPageComponent }
];

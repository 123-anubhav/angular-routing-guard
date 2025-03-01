# Angular Routing Guard

## Table of Contents
- [Introduction](#introduction)
- [Angular Routing and Guards](#angular-routing-and-guards)
- [Implementation](#implementation)
  - [Defining Routes](#defining-routes)
  - [Creating Authentication Service](#creating-authentication-service)
  - [Creating Auth Guard Service](#creating-auth-guard-service)
  - [Adding Auth Guard to Routes](#adding-auth-guard-to-routes)
  - [Creating Components](#creating-components)
- [Flow of Execution](#flow-of-execution)
- [Commands](#commands)
- [Common Interview Questions](#common-interview-questions)
- [Conclusion](#conclusion)

## Introduction
Angular Routing Guards are used to secure routes by restricting access based on user authentication or authorization. They act as a middleware that checks certain conditions before allowing navigation to a specific route.

## Angular Routing and Guards
Angular provides the following types of guards:
1. **CanActivate** - Prevents unauthorized access to a route.
2. **CanActivateChild** - Restricts child routes.
3. **CanDeactivate** - Prevents navigation away from a route.
4. **Resolve** - Fetches data before loading a route.
5. **CanLoad** - Restricts loading of lazy-loaded modules.

## Implementation

### Defining Routes
```typescript
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
```

### Creating Authentication Service
```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn: boolean = false;

  isAuthenticated() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.loggedIn), 2000);
    });
  }

  login() { this.loggedIn = true; }
  logout() { this.loggedIn = false; }
}
```

### Creating Auth Guard Service
```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardServiceService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  async canActivate(): Promise<boolean> {
    const authenticated = await this.authService.isAuthenticated();
    if (authenticated) {
      console.log('Access granted');
      return true;
    } else {
      console.log('Access denied');
      this.router.navigate(['not-access']);
      return false;
    }
  }
}
```

### Adding Auth Guard to Routes
The `canActivate` property in the route configuration ensures that the user is authenticated before accessing the `products` page.

### Creating Components
#### Home Component (Handles Login/Logout)
```typescript
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private authService: AuthService) {}

  login() { this.authService.login(); }
  logout() { this.authService.logout(); }
}
```

#### Not Access Page (Unauthorized Users)
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-not-access-page',
  templateUrl: './not-access-page.component.html',
  styleUrls: ['./not-access-page.component.css']
})
export class NotAccessPageComponent {}
```

## Flow of Execution
1. User tries to access `/products`.
2. `AuthGuardServiceService` calls `AuthService.isAuthenticated()`.
3. If the user is authenticated, navigation proceeds.
4. If not, the user is redirected to `not-access`.

## Commands
### Create a new Angular project:
```sh
ng new angular-routing-guard
cd angular-routing-guard
```
### Generate Components and Services:
```sh
ng g c home
ng g c products
ng g c customers
ng g c not-access-page
ng g s auth
ng g s auth-guard-service
```
### Serve the application:
```sh
ng serve --open
```

## Common Interview Questions
1. **What is an Angular Route Guard?**
   - It is a mechanism to control navigation by preventing unauthorized access.
2. **What types of route guards exist in Angular?**
   - CanActivate, CanActivateChild, CanDeactivate, Resolve, CanLoad.
3. **How does CanActivate work?**
   - It decides whether to allow navigation to a route.
4. **How do you protect lazy-loaded modules?**
   - Using `CanLoad` guard.
5. **How do you handle async authentication checks?**
   - Using Promises or Observables in `AuthService`.
6. **What happens if a guard returns false?**
   - Navigation is blocked, and the user is redirected.

## Conclusion
Angular Route Guards enhance security by preventing unauthorized access. Using `CanActivate`, we can ensure that protected routes are accessible only to authenticated users. By integrating guards with authentication services, we create a robust security layer for Angular applications.


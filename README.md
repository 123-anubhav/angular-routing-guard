# angular-routing-guard
angular-routing-guard helpful for jwt, security functionality with backend

### Explanation and Code Walkthrough

This is a small Angular app that demonstrates route guards with authentication logic. Here's an explanation of each part of the code:

### 1. **AuthService (Authentication Service)**

The `AuthService` handles the authentication state of the application. It includes methods for logging in, logging out, and checking if the user is authenticated.

#### **Code: `auth.service.ts`**
```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: boolean = false;

  constructor() { }

  // Simulates an API call to check authentication status (async)
  isAuthenticed() {
    const promise = new Promise(
      (resolve, reject) => {
        // Mimic backend API call with a delay of 2 seconds
        setTimeout(
          () => {
            resolve(this.loggedIn); // Resolve with the current loggedIn status
          }, 2000
        );
      }
    );
    return promise;
  }

  // Method to log the user in
  login() {
    this.loggedIn = true;
  }

  // Method to log the user out
  logout() {
    this.loggedIn = false;
  }
}
```

**Explanation:**
- `isAuthenticed()`: Returns a promise that simulates an asynchronous check of whether the user is authenticated (`loggedIn`).
- `login()` and `logout()`: Methods that modify the `loggedIn` state.

### 2. **AuthGuardService (Route Guard Service)**

The `AuthGuardServiceService` implements Angular's `CanActivate` guard to protect the routes. If the user is authenticated, the route is allowed; otherwise, the user is redirected to an error page.

#### **Code: `auth-guard-service.service.ts`**
```typescript
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardServiceService implements CanActivate {

  constructor(private authService: AuthService, private route: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.authService.isAuthenticed()
      .then((authenticated: boolean) => {
        if (authenticated) {
          console.log('Guard Received true ==> Route Access Allowed');
          return true; // Allow route navigation
        } else {
          console.log('Guard Received false ==> Route Access Denied');
          this.route.navigate(['error']); // Redirect to error page
          return false; // Prevent navigation
        }
      })
      .catch(error => {
        console.error('Error in authentication check:', error);
        this.route.navigate(['error']); // Redirect to error page in case of error
        return false;
      });
  }
}
```

**Explanation:**
- `canActivate()`: This method checks if the user is authenticated by calling `this.authService.isAuthenticed()`. If the user is authenticated, it allows the route to be accessed (`return true`). If not, it redirects the user to the `error` page and denies access (`return false`).

### 3. **Routing Configuration**

In the `app-routing.module.ts` file, we define routes for different components and protect the `products` route with the `AuthGuardServiceService` guard.

#### **Code: `app-routing.module.ts`**
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
    { path: '**', component: NotAccessPageComponent } // Wildcard route for 404
];
```

**Explanation:**
- The `products` route is protected by the `AuthGuardServiceService`, which ensures only authenticated users can access it.
- Any undefined route (`**`) will navigate to the `NotAccessPageComponent`.

### 4. **Home Component (Login/Logout)**

The `HomeComponent` provides the functionality to log in and log out, updating the authentication status accordingly.

#### **Code: `home.component.ts`**
```typescript
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private service: AuthService) { }

  login() {
    this.service.login(); // Log the user in
  }

  logout() {
    this.service.logout(); // Log the user out
  }
}
```

**Explanation:**
- `login()`: Calls `this.service.login()` to set `loggedIn` to `true`.
- `logout()`: Calls `this.service.logout()` to set `loggedIn` to `false`.

#### **Template: `home.component.html`**
```html
<div class="container">
    <p>Home works!</p>
    <div class="text-center h3">
        <button (click)="login()">Login</button>&nbsp;&nbsp;&nbsp;&nbsp;
        <button (click)="logout()">Logout</button>
    </div>
</div>
```

### 5. **Navigation (Navbar)**

This is a simple navbar that allows users to navigate between the different routes: `home`, `products`, and `customers`.

#### **Code: Navbar HTML**
```html
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand text-danger" routerLink="#">Routing Guard</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" routerLink="/home" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/products" routerLinkActive="active">Products</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/customers" routerLinkActive="active">Customers</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
<router-outlet></router-outlet>
```

**Explanation:**
- This navbar uses `routerLink` to navigate between different components and `routerLinkActive` to highlight the active route.
- `<router-outlet></router-outlet>` is where the routed component gets displayed.

### 6. **Not Access Page (Error Page)**

If a user tries to access a protected route without being authenticated, they are redirected to the `NotAccessPageComponent`.

#### **Code: `not-access-page.component.html`**
```html
<div class="container text-danger h3">
    <p>Not Access Page!</p>
    <br/>
    Please log in to access the <b class="text-warning h2">products page</b>.
    <hr/>
    <h3>Check your console for more information.</h3>
    <h4 class="text-secondary">
        Guard received false value ==> Hence routing module will reject.
    </h4>
</div>
```

#### **Code: `not-access-page.component.ts`**
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-not-access-page',
  templateUrl: './not-access-page.component.html',
  styleUrls: ['./not-access-page.component.css']
})
export class NotAccessPageComponent { }
```

### **README.md**

```markdown
# Angular Route Guard with Authentication Example

This is a simple Angular application demonstrating route guards and authentication logic. The app includes:

- **Authentication Service**: Manages user login/logout status.
- **Auth Guard**: Protects certain routes (e.g., `/products`) from unauthorized access.
- **Home Component**: Allows users to log in and log out.
- **Products Component**: A protected route that can only be accessed when authenticated.
- **Error Page**: Displays an error message if the user tries to access a protected route without being authenticated.

## Features

- **Route Protection**: Use `CanActivate` guards to protect routes from unauthorized access.
- **Login/Logout**: Simulate user login/logout and adjust route access.
- **Error Handling**: Redirect users to an error page if they try to access a protected route without authentication.

## Setup

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `ng serve` to start the development server.
4. Open the app in your browser at `http://localhost:4200`.

## Routes

- `/home`: The home page where users can log in and out.
- `/products`: A protected route that requires

 authentication to access.
- `/customers`: A public route for customers.
- `/error`: Displays an error message when the user is not authenticated.

## Components

- **HomeComponent**: Contains login/logout buttons.
- **ProductsComponent**: The protected component that requires authentication.
- **NotAccessPageComponent**: Displays an error message if the user is not authenticated.

```

---

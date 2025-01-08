import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const token = localStorage.getItem('token');  // Vérifiez si un token est stocké
    if (token) {
      return true;  // L'utilisateur est connecté, permet l'accès
    } else {
      this.router.navigate(['/login']);  // Redirige vers la page de login si non connecté
      return false;  // Empêche l'accès à la route
    }
  }
}

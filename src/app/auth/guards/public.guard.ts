import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    CanMatchFn,
    Route,
    Router,
    RouterStateSnapshot,
    UrlSegment,
  } from '@angular/router';
  import { Observable, map, tap } from 'rxjs';
  import { AuthService } from '../services/auth.service';
  import { inject } from '@angular/core';
  
  
  const checkAuthStatus = ():Observable<boolean> => {
    const authService: AuthService= inject(AuthService);
    const router: Router = inject(Router);
  
    return authService.checkAuthStatus()
    .pipe(
      tap( (isAuthenticated)=> console.log('Autenticado', isAuthenticated)),
      tap( (isAuthenticated)=> {
        if(isAuthenticated) {
          router.navigate(['/']);
        } 
      } ),
      map( isAuthenticated=> !isAuthenticated )
    )
  }

  //No hay necesidad de crear una clase, simplemente definiendo una función flecha y exportándola podemos utilizar sus funcionalidades de guard en el app-routing
export const publicGuard: CanActivateFn = ( //Hay que tener en cuenta el tipado CanActiveFn
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
    console.log('CanActivate');
    console.log({ route, state });
   
    return checkAuthStatus();
  };
   
  export const publicMatchGuard: CanMatchFn = ( //Tipado CanMatchFN
    route: Route,
    segments: UrlSegment[]
  ) => {
    console.log('CanMatch');
    console.log({ route, segments });
   
    return checkAuthStatus();
  };
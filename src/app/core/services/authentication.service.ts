import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Login } from 'src/app/shared/models/login';
import { ApiService } from './api.service';
import { JwtStorageService } from './jwt-storage.service';
import { JwtHelperService } from "@auth0/angular-jwt";
import { User } from 'src/app/shared/models/user';

@Injectable({
  providedIn: 'root'
})


export class AuthenticationService {

  private user:User;

  private currentLogedInUserSubject = new BehaviorSubject<User>( {} as User);
  public currentLogedInUser = this.currentLogedInUserSubject.asObservable();

  private isUserAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isUserAuthenticated = this.isUserAuthenticatedSubject.asObservable();

  constructor(private apiService:ApiService, private jwtStorageService:JwtStorageService) { }

  // login component will call this one
  login(userLogin: Login): Observable<boolean> {
    return this.apiService.create('account/login', userLogin).pipe(
      map((response) => {
        if (response) {
          // once we get the JWT token API, Angular will save that token in local storage
          this.jwtStorageService.saveToken(response.token);

          this.populateLogedInUserInfo();

          // then decode that token and fill up User object
          return true;
        }
        return false;
      })
    );
  }

  populateLogedInUserInfo() {
    if (this.jwtStorageService.getToken()) {
      const token = this.jwtStorageService.getToken();
      const decodedToken = this.decodeJWT();
      this.currentLogedInUserSubject.next(decodedToken);
      this.isUserAuthenticatedSubject.next(true);
    }
  }

  private decodeJWT():User|null{
    // first get the token from local storage
    const token = this.jwtStorageService.getToken();

    // we need to check token is not empty or null and check the token is not expired

    if (!token || new JwtHelperService().isTokenExpired(token)){
      return null
    }

    // decode the token and create the user object
    const decodedToken = new JwtHelperService().decodeToken(token);
    this.user = decodedToken;
    return this.user;

  }

  //sign-up component will call this one
  register(){

  }

  //from header when we click on logout it will call this method
  logout(){
    //remove token from local storage
    this.jwtStorageService.destroyToken();

    //set current user subject to empty object
    this.currentLogedInUserSubject.next({} as User);

    //set Auth User subject to false
    this.isUserAuthenticatedSubject.next(false);
  }
}

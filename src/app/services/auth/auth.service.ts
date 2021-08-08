import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtResponseModel } from 'src/app/models/security/jwt.response.model';
import { JwtRequestModel } from 'src/app/models/security/jwt.request.model';
import { UserModel } from 'src/app/models/user.model';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentTokenSubject: BehaviorSubject<JwtResponseModel>;
  private currentUserSubject: BehaviorSubject<UserModel>;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.currentTokenSubject = new BehaviorSubject<JwtResponseModel>(JSON.parse(localStorage.getItem('jwt')));
    this.currentUserSubject = new BehaviorSubject<UserModel>(JSON.parse(localStorage.getItem('user')));
  }
  
  public get currentTokenValue(): JwtResponseModel {
    return this.currentTokenSubject.value;
  }

  public set currentTokenValue(jwtResponse: JwtResponseModel) {
    this.currentTokenSubject.next(jwtResponse);
  }

  public get currentUserValue(): UserModel {
    var user = this.currentUserSubject.value;
    if(user == null) {
      return new UserModel();
    }
    return this.currentUserSubject.value;
  }

  public set currentUserValue(user: UserModel) {
    this.currentUserSubject.next(user);
  }

  signup(email: string, password: string) : Observable<void> {
    var jwtRequest = new JwtRequestModel();
    jwtRequest.email = email;
    jwtRequest.password = password;
    return this.http.post<any>(`${this.configService.get('apiUrl')}/auth/signup`, jwtRequest);
  }
  
  login(email: string, password: string) : Observable<JwtResponseModel> {
    var jwtRequest = new JwtRequestModel();
    jwtRequest.email = email;
    jwtRequest.password = password;
    return this.http.post<any>(`${this.configService.get('apiUrl')}/auth/login`, jwtRequest);
  }
  
  whoami() {
    if(this.currentTokenValue != null) {
      this.http.get<UserModel>(`${this.configService.get('apiUrl')}/auth/whoami`)
        .subscribe(res => {
          localStorage.setItem('user', JSON.stringify(res));
          this.currentUserSubject.next(res);
        });
    }
  }

}

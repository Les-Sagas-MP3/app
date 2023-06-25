import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { JwtResponseModel } from 'src/app/models/security/jwt.response.model';
import { JwtRequestModel } from 'src/app/models/security/jwt.request.model';
import { RoleModel } from 'src/app/models/role/role.model';
import { UserModel } from 'src/app/models/user/user.model';
import { ConfigService } from '../config/config.service';
import { RoleName } from 'src/app/models/role/role.name';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentTokenSubject: BehaviorSubject<JwtResponseModel>;
  private currentRolesSubject: BehaviorSubject<RoleModel[]>;
  private currentUserSubject: BehaviorSubject<UserModel>;

  constructor(private http: HttpClient, private configService: ConfigService) {
    if(localStorage.getItem('jwt') != '') {
      this.currentTokenSubject = new BehaviorSubject<JwtResponseModel>(JSON.parse(localStorage.getItem('jwt')!!));
    } else {
      this.currentTokenSubject = new BehaviorSubject<JwtResponseModel>(new JwtResponseModel());
    }
    if(localStorage.getItem('user') != '') {
      this.currentUserSubject = new BehaviorSubject<UserModel>(JSON.parse(localStorage.getItem('user')!!));
    } else {
      this.currentUserSubject = new BehaviorSubject<UserModel>(new UserModel());
    }
    if(localStorage.getItem('roles') != '') {
      this.currentRolesSubject = new BehaviorSubject<RoleModel[]>(JSON.parse(localStorage.getItem('roles')!!));
    } else {
      this.currentRolesSubject = new BehaviorSubject<RoleModel[]>([]);
    }
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

  public isLoggedIn(): boolean {
    return this.currentTokenValue != null && this.currentTokenValue.token != '';
  }

  signup(user: UserModel) : Observable<void> {
    return this.http.post<any>(`${this.configService.get('apiUrl')}/auth/signup`, user);
  }
  
  login(email: string, password: string) : Observable<JwtResponseModel> {
    var jwtRequest = new JwtRequestModel();
    jwtRequest.email = email;
    jwtRequest.password = password;
    return this.http.post<any>(`${this.configService.get('apiUrl')}/auth/login`, jwtRequest);
  }
  
  whoami() {
    let user = this.http.get<UserModel>(`${this.configService.get('apiUrl')}/auth/whoami/user`);
    let roles = this.http.get<RoleModel[]>(`${this.configService.get('apiUrl')}/auth/whoami/roles`);
    forkJoin([user, roles]).subscribe(results => {
      localStorage.setItem('user', JSON.stringify(results[0]));
      this.currentUserSubject.next(results[0]);
      localStorage.setItem('roles', JSON.stringify(results[1]));
      this.currentRolesSubject.next(results[1]);
    }, error => {
      console.log(error);
      this.logout();
    });
  }

  logout() {
    localStorage.setItem('jwt', '');
    this.currentTokenValue = new JwtResponseModel();
    localStorage.setItem('user', '');
    this.currentUserValue = new UserModel();
  }

  get isAdmin() {
    const isAdmin = this.currentRolesSubject != null;
    return isAdmin && this.currentRolesSubject.value.some(a => a.name === RoleName.ADMINISTRATOR);
  }
}

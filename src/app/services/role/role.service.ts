import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { RoleModel } from 'src/app/models/role/role.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient, private configService: ConfigService) { }

  getAllByUserId(userId: number): Observable<RoleModel[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<RoleModel[]>(`${this.configService.get('apiUrl')}/role`, { params });
  }
}

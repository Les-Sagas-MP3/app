import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { Observable } from 'rxjs';
import { DataPage } from 'src/app/models/pagination/data.page';
import { UserModel } from 'src/app/models/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private configService: ConfigService) { }
  
  getPaginated(offset: number, limit: number) : Observable<DataPage<UserModel>> {
    const params = new HttpParams()
        .set('offset', offset.toString())
        .set('limit', limit.toString());
    return this.http.get<DataPage<UserModel>>(`${this.configService.get('apiUrl')}/user`, { params });
  }

  search(search: string): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.configService.get('apiUrl')}/user?search=${search}`);
  }

}

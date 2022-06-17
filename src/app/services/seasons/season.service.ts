import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SeasonModel } from 'src/app/models/season.model';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {

  constructor(private http: HttpClient, private configService: ConfigService) { }

  getById(id: number) : Observable<SeasonModel> {
    return this.http.get<SeasonModel>(`${this.configService.get('apiUrl')}/season/${id}`);
  }
  
  getAllByIds(ids: number[]) {
    const params = new HttpParams()
      .set('ids', ids.toString());
    return this.http.get<SeasonModel[]>(`${this.configService.get('apiUrl')}/season`, { params });
  }

  create(season: SeasonModel) {
    return this.http.post<SeasonModel>(`${this.configService.get('apiUrl')}/season`, season);
  }

}

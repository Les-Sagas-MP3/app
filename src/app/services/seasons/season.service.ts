import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SeasonModel } from 'src/app/models/season.model';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {

  constructor(private http: HttpClient) { }
  
  getAllByIds(ids: number[]) {
    const params = new HttpParams()
        .set('ids', ids.toString());
    return this.http.get<SeasonModel[]>(`${environment.apiUrl}/season`, { params });
  }

}

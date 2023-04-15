import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SagaModel } from 'src/app/models/saga/saga.model';
import { DataPage } from 'src/app/models/pagination/data.page';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class SagaService {
  constructor(private http: HttpClient, private configService: ConfigService) { }
  
  getAll() : Observable<SagaModel[]> {
    return this.http.get<SagaModel[]>(`${this.configService.get('apiUrl')}/saga`);
  }

  getById(id: number) : Observable<SagaModel> {
    return this.http.get<SagaModel>(`${this.configService.get('apiUrl')}/saga/${id}`);
  }
  
  getPaginated(offset: number, limit: number) : Observable<DataPage<SagaModel>> {
    const params = new HttpParams()
        .set('offset', offset.toString())
        .set('limit', limit.toString());
    return this.http.get<DataPage<SagaModel>>(`${this.configService.get('apiUrl')}/saga`, { params });
  }

  search(search: string): Observable<SagaModel[]> {
    return this.http.get<SagaModel[]>(`${this.configService.get('apiUrl')}/saga?search=${search}`);
  }

  create(saga: SagaModel) {
    return this.http.post<SagaModel>(`${this.configService.get('apiUrl')}/saga`, saga);
  }

  update(episode: SagaModel) {
    return this.http.put<SagaModel>(`${this.configService.get('apiUrl')}/saga`, episode);
  }

  uploadPdf(file : any): Observable<SagaModel> {
    let formData = new FormData();
    formData.append("file", file, file.name);
    return this.http.post<SagaModel>(`${this.configService.get('apiUrl')}/saga/pdf`, formData);
  }

}

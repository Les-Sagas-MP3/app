import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoryModel } from 'src/app/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getAll() : Observable<CategoryModel[]> {
    return this.http.get<CategoryModel[]>(`${environment.apiUrl}/categories`);
  }

  getAllByIds(ids: number[]) {
    const params = new HttpParams()
        .set('ids', ids.toString());
    return this.http.get<CategoryModel[]>(`${environment.apiUrl}/categories`, { params });
  }

}

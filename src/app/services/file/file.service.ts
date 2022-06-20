import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileModel } from 'src/app/models/file.model';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  maxFileSize = 20971520;

  constructor(private http: HttpClient, private configService: ConfigService) { }

  getById(id: number) : Observable<FileModel> {
    return this.http.get<FileModel>(`${this.configService.get('apiUrl')}/file/${id}`);
  }
  
  upload(file, directory, name): Observable<FileModel> {
    let formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("directory", directory);
    formData.append("name", name);
    return this.http.post<FileModel>(`${this.configService.get('apiUrl')}/file/upload`, formData);
  }
}

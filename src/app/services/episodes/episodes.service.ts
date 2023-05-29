import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EpisodeModel } from 'src/app/models/episode.model';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class EpisodesService {

  constructor(private http: HttpClient, private configService: ConfigService) { }

  getById(id: number) : Observable<EpisodeModel> {
    return this.http.get<EpisodeModel>(`${this.configService.get('apiUrl')}/episode/${id}`);
  }
  
  getAllByIds(ids: number[]) {
    const params = new HttpParams()
      .set('ids', ids.toString());
    return this.http.get<EpisodeModel[]>(`${this.configService.get('apiUrl')}/episode`, { params });
  }

  getAllBySeasonId(seasonRef: number) {
    return this.http.get<EpisodeModel[]>(`${this.configService.get('apiUrl')}/episode?seasonRef=${seasonRef}`);
  }

  create(episode: EpisodeModel) {
    return this.http.post<EpisodeModel>(`${this.configService.get('apiUrl')}/episode`, episode);
  }

  update(episode: EpisodeModel) {
    return this.http.put<EpisodeModel>(`${this.configService.get('apiUrl')}/episode`, episode);
  }
}

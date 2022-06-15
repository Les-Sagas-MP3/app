import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Episode } from 'src/app/entities/episode';
import { Saga } from 'src/app/entities/saga';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { EpisodesService } from 'src/app/services/episodes/episodes.service';
import { SagaService } from 'src/app/services/sagas/saga.service';

@Component({
  selector: 'app-play-episode',
  templateUrl: './play-episode.page.html',
  styleUrls: ['./play-episode.page.scss'],
})
export class PlayEpisodePage implements OnInit {

  public saga: Saga = new Saga();
  public episode: Episode = new Episode();

  constructor(
    private activatedRoute: ActivatedRoute,
    public loadingController: LoadingController,
    private authService: AuthService,
    public configService: ConfigService,
    private sagaService: SagaService,
    private episodeService: EpisodesService) { }


  ngOnInit() {
    var sagaId: number = +this.activatedRoute.snapshot.paramMap.get('saga');
    var episodeId: number = +this.activatedRoute.snapshot.paramMap.get('episode');
    this.loadingController.create({
      message: 'Téléchargement...'
    }).then((loading) => {
      loading.present();
      this.sagaService.getById(sagaId)
        .subscribe(data => {
          this.saga = Saga.fromModel(data);
          this.episodeService.getById(episodeId)
            .subscribe(data => {
              this.episode = Episode.fromModel(data);
              loading.dismiss();
            });
        });
    });
  }

  coverUrl(): string {
    if(this.saga.coverUrl) {
      return this.configService.get('appUrl') + this.saga.coverUrl;
    } else {
      return '';
    }
  }
}

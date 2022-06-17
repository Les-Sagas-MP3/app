import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { Episode } from 'src/app/entities/episode';
import { Saga } from 'src/app/entities/saga';
import { Season } from 'src/app/entities/season';
import { SeasonModel } from 'src/app/models/season.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { EpisodesService } from 'src/app/services/episodes/episodes.service';
import { SagaService } from 'src/app/services/sagas/saga.service';
import { SeasonService } from 'src/app/services/seasons/season.service';

@Component({
  selector: 'app-list-episodes',
  templateUrl: './list-episodes.page.html',
  styleUrls: ['./list-episodes.page.scss'],
})
export class ListEpisodesPage implements OnInit {

  public saga: Saga = new Saga();
  public season: Season = new Season();

  constructor(
    public actionSheetController: ActionSheetController,
    private activatedRoute: ActivatedRoute,
    public loadingController: LoadingController,
    public authService: AuthService,
    public configService: ConfigService,
    private episodeService: EpisodesService,
    private sagaService: SagaService,
    private seasonService: SeasonService) { }

  ngOnInit() {
    var sagaId: number = +this.activatedRoute.snapshot.paramMap.get('sagaId');
    var seasonId: number = +this.activatedRoute.snapshot.paramMap.get('seasonId');
    this.loadingController.create({
      message: 'Téléchargement...'
    }).then((loading) => {
      loading.present();
      this.sagaService.getById(sagaId)
        .subscribe(data => {
          this.saga = Saga.fromModel(data);
          this.seasonService.getById(seasonId)
            .subscribe(data => {
              this.season = Season.fromModel(data);
              this.episodeService.getAllByIds(this.season.episodesRef)
                .subscribe(data => {
                  this.season.episodes = Episode.fromModels(data);
                  loading.dismiss();
                })
            });
        });
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { Episode } from 'src/app/entities/episode';
import { Saga } from 'src/app/entities/saga';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { EpisodesService } from 'src/app/services/episodes/episodes.service';
import { SagaService } from 'src/app/services/sagas/saga.service';

@Component({
  selector: 'app-edit-episode',
  templateUrl: './edit-episode.page.html',
  styleUrls: ['./edit-episode.page.scss'],
})
export class EditEpisodePage implements OnInit {

  public saga: Saga = new Saga();
  public episode: Episode = new Episode();


  constructor(
    private activatedRoute: ActivatedRoute,
    public loadingController: LoadingController,
    public navCtrl: NavController,
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

  save() {
    console.log("save !");
    this.navCtrl.navigateBack('/sagas/' + this.saga.id + '/episode/' + this.episode.id);
  }

}

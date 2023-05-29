import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { forkJoin, map } from 'rxjs';

import { Episode } from 'src/app/entities/episode';
import { File } from 'src/app/entities/file';
import { Saga } from 'src/app/entities/saga';
import { StreamState } from 'src/app/interfaces/stream-state';
import { SagaModel } from 'src/app/models/saga/saga.model';
import { AudioService } from 'src/app/services/audio/audio.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { EpisodesService } from 'src/app/services/episodes/episodes.service';
import { FileService } from 'src/app/services/file/file.service';
import { SagaService } from 'src/app/services/sagas/saga.service';

@Component({
  selector: 'app-play-episode',
  templateUrl: './play-episode.page.html',
  styleUrls: ['./play-episode.page.scss'],
})
export class PlayEpisodePage implements OnInit {

  public saga: Saga = new Saga();
  public seasonEpisodes: Episode[] = [];
  public episode: Episode = new Episode();
  state: StreamState = {
    playing: false,
    readableCurrentTime: '',
    readableDuration: '',
    duration: undefined,
    currentTime: undefined,
    canplay: false,
    error: false,
  };

  sliderBeingUpdated = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    public loadingController: LoadingController,
    private navCtrl: NavController,
    public audioService: AudioService,
    public authService: AuthService,
    public configService: ConfigService,
    private sagaService: SagaService,
    private episodeService: EpisodesService,
    private fileService: FileService) {
    this.audioService.getState().subscribe(state => {
      this.state = state;
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    var sagaId: number = +this.activatedRoute.snapshot.paramMap.get('saga')!;
    var episodeId: number = +this.activatedRoute.snapshot.paramMap.get('episode')!;
    this.loadingController.create({
      message: 'Téléchargement...'
    }).then((loading) => {
      loading.present();
      this.sagaService.getById(sagaId)
        .subscribe((data: SagaModel) => {
          this.saga = Saga.fromModel(data);
          this.episodeService.getById(episodeId)
            .subscribe(data => {
              this.episode = Episode.fromModel(data);
              let episodes = this.episodeService.getAllBySeasonId(this.episode.seasonRef);
              let file = this.fileService.getById(this.episode.fileRef);
              forkJoin([episodes, file])
              .pipe(
                map(([episodes, file]) => {
                  return {
                    episodes: episodes,
                    file: file,
                  };
                })
              )
              .subscribe(results => {
                this.seasonEpisodes = Episode.fromModels(results.episodes);
                if (results.file !== null) {
                  this.episode.file = File.fromModel(results.file);
                  this.playStream(this.episodeUrl());
                }
                loading.dismiss();
              });
            });
        });
    });
  }

  playStream(url: string) {
    this.audioService.playStream(url).subscribe(() => { });
  }

  play() {
    this.audioService.play();
  }

  pause() {
    this.audioService.pause();
  }

  stop() {
    this.audioService.stop();
  }

  ionKnobMoveStart() {
    this.sliderBeingUpdated = true;
  }

  ionKnobMoveEnd(event: any) {
    this.audioService.seekTo(event.detail.value);
    this.sliderBeingUpdated = false;
  }

  isFirstPlaying() {
    return this.seasonEpisodes.find(episode => episode.number < this.episode.number) === undefined;
  }

  isLastPlaying() {
    return this.seasonEpisodes.find(episode => episode.number > this.episode.number) === undefined;
  }

  previous() {
    this.stop();
    let targetEpisodeId = this.seasonEpisodes[this.seasonEpisodes.findIndex(episode => episode.id === this.episode.id) - 1]?.id;
    this.navCtrl.navigateForward('/sagas/' + this.saga.id + '/episode/' + targetEpisodeId);
  }

  next() {
    this.stop();
    let targetEpisodeId = this.seasonEpisodes[this.seasonEpisodes.findIndex(episode => episode.id === this.episode.id) + 1]?.id;
    this.navCtrl.navigateForward('/sagas/' + this.saga.id + '/episode/' + targetEpisodeId);
  }

  coverUrl(): string {
    if(this.saga.coverUrl) {
      return this.configService.get('apiUrl') + "/files/image" + this.saga.coverUrl;
    } else {
      return '';
    }
  }

  episodeUrl(): string {
    if(this.episode.file.url.startsWith("http")) {
      return this.episode.file.url;
    } else {
      return this.configService.get('apiUrl') + "/files/audio" + this.episode.file.url;
    }
  }
}

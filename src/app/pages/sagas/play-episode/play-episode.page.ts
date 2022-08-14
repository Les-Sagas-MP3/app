import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { Episode } from 'src/app/entities/episode';
import { File } from 'src/app/entities/file';
import { Saga } from 'src/app/entities/saga';
import { StreamState } from 'src/app/interfaces/stream-state';
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
  public episode: Episode = new Episode();
  state: StreamState;
  
  sliderBeingUpdated = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    public loadingController: LoadingController,
    public audioService: AudioService,
    private authService: AuthService,
    public configService: ConfigService,
    private sagaService: SagaService,
    private episodeService: EpisodesService,
    private fileService: FileService) {
      this.audioService.getState().subscribe(state => {
        this.state = state;
      });
    }


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
              this.fileService.getById(this.episode.fileRef)
                .subscribe(data => {
                  if(data !== null) {
                    this.episode.file = File.fromModel(data);
                    this.playStream(this.episodeUrl());
                  }
                  loading.dismiss();
                })
            });
        });
    });
  }

  playStream(url) {
    this.audioService.playStream(url).subscribe(() => {});
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

  ionKnobMoveEnd(event) {
    this.audioService.seekTo(event.detail.value);
    this.sliderBeingUpdated = false;
  }

  isFirstPlaying() {
    return false;
  }

  isLastPlaying() {
    return false;
  }

  coverUrl(): string {
    if(this.saga.coverUrl) {
      return this.configService.get('appUrl') + this.saga.coverUrl;
    } else {
      return '';
    }
  }

  episodeUrl(): string {
    return this.configService.get('apiUrl') + "/files/audio" + this.episode.file.url;
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { Episode } from 'src/app/entities/episode';
import { Saga } from 'src/app/entities/saga';
import { Season } from 'src/app/entities/season';
import { EpisodeModel } from 'src/app/models/episode.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { EpisodesService } from 'src/app/services/episodes/episodes.service';
import { FileService } from 'src/app/services/file/file.service';
import { SagaService } from 'src/app/services/sagas/saga.service';
import { SeasonService } from 'src/app/services/seasons/season.service';

@Component({
  selector: 'app-edit-episode',
  templateUrl: './edit-episode.page.html',
  styleUrls: ['./edit-episode.page.scss'],
})
export class EditEpisodePage implements OnInit {

  public saga: Saga = new Saga();
  public episode: Episode = new Episode();

  episodeForm: FormGroup;
  attemptedSubmit = false;
  fileSource = ''

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public authService: AuthService,
    public configService: ConfigService,
    private episodeService: EpisodesService,
    private fileService: FileService,
    private sagaService: SagaService,
    private seasonService: SeasonService) {
      
      this.episodeForm = this.fb.group({
        seasonRef: ['', [Validators.required]],
        number: [''],
        title: ['', [Validators.required]],
        infos: [''],
        file: [''],
        fileSource: ['']
      });
    }


  ngOnInit() {
    var sagaId: number = +this.activatedRoute.snapshot.paramMap.get('saga')!;
    var episodeId: number = +this.activatedRoute.snapshot.paramMap.get('episode')!;
    this.loadingController.create({
      message: 'Téléchargement...'
    }).then((loading) => {
      loading.present();
      this.sagaService.getById(sagaId)
        .subscribe(data => {
          this.saga = Saga.fromModel(data);
          let episode = this.episodeService.getById(episodeId);
          let seasons = this.seasonService.getAllByIds(data.seasonsRef);
          forkJoin([episode, seasons]).subscribe(results => {
            this.episode = Episode.fromModel(results[0]);
            if(this.episode.fileRef) {
              this.fileSource = "audio.mp3";
            }
            this.saga.seasons = Season.fromModels(results[1]);
            loading.dismiss();
          });
        });
    });
  }

  markFieldsDirty() {
    const controls = this.episodeForm.controls;
    for (const field in controls) {
      if (controls[field]) {
        controls[field].markAsDirty();
      }
    }
  }

  async save() {
    this.attemptedSubmit = true;
    if (this.episodeForm.valid) {      
      const controls = this.episodeForm.controls;
      this.loadingController.create({
        message: 'Sauvegarde en cours...'
      }).then((loading) => {
        loading.present();
        let episode = new EpisodeModel();
        episode.id = this.episode.id;
        episode.fileRef = this.episode.fileRef;
        episode.workspace = this.episode.workspace;
        episode.seasonRef = controls['seasonRef'].value;
        episode.displayedNumber = controls['number'].value;
        episode.title = controls['title'].value;
        episode.infos = controls['infos'].value;
        if(controls['fileSource'].value) {
          this.fileService.upload(controls['fileSource'].value, "sagas/" + this.saga.workspace + "/episodes/" + this.episode.workspace, "audio")
            .subscribe(data => {
              console.debug(data);
              episode.fileRef = data.id;
              this.episodeService.update(episode)
                .subscribe(data => {
                  console.debug(data);
                  this.navCtrl.navigateForward("sagas/" + this.saga.id)
                  loading.dismiss();
                }, error => {
                  console.error(error);
                  loading.dismiss();
                });
            });
        } else {
          this.episodeService.update(episode)
          .subscribe(data => {
            console.debug(data);
            this.navCtrl.navigateForward("sagas/" + this.saga.id)
            loading.dismiss();
          }, error => {
            console.error(error);
            loading.dismiss();
          });
        }
      });
    } else {
      this.markFieldsDirty();
    }
  }

  onFileChange(event: any) {  
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if(file.size <= this.fileService.maxFileSize) {
        this.episodeForm.patchValue({
          fileSource: file
        });
        this.fileSource = file.name;
      }
    }
  }

}

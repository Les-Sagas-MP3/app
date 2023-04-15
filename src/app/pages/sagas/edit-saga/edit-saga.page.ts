import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { forkJoin, map } from 'rxjs';
import { Saga } from 'src/app/entities/saga';
import { SagaModel } from 'src/app/models/saga/saga.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { FileService } from 'src/app/services/file/file.service';
import { SagaService } from 'src/app/services/sagas/saga.service';

@Component({
  selector: 'app-edit-saga',
  templateUrl: './edit-saga.page.html',
  styleUrls: ['./edit-saga.page.scss'],
})
export class EditSagaPage implements OnInit {

  public saga: Saga = new Saga();

  sagaForm: FormGroup;
  attemptedSubmit = false;
  bannerSource = '';
  coverSource = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public authService: AuthService,
    public configService: ConfigService,
    private fileService: FileService,
    private sagaService: SagaService) {

    this.sagaForm = this.fb.group({
      title: ['', [Validators.required]],
      url: [],
      urlWiki: [],
      status: [],
      synopsis: [],
      origin: [],
      genese: [],
      awards: [],
      banner: [''],
      bannerSource: [''],
      cover: [''],
      coverSource: ['']
    });
  }

  ngOnInit() {
    var sagaId: number = +this.activatedRoute.snapshot.paramMap.get('id')!;
    this.loadingController.create({
      message: 'Téléchargement...'
    }).then((loading) => {
      loading.present();
      this.sagaService.getById(sagaId)
        .subscribe(data => {
          this.saga = Saga.fromModel(data);
          loading.dismiss();
        });
    });
  }

  markFieldsDirty() {
    const controls = this.sagaForm.controls;
    for (const field in controls) {
      if (controls[field]) {
        controls[field].markAsDirty();
      }
    }
  }

  updateSaga(loading: HTMLIonLoadingElement, saga: SagaModel) {
    this.sagaService.update(saga)
      .subscribe({
        next: (data) => {
          console.debug(data);
          loading.dismiss();
          this.navCtrl.navigateForward("sagas/" + this.saga.id)
        },
        error: error => {
          console.error(error);
          loading.dismiss();
        }
      }
      );
  }

  async save() {
    this.attemptedSubmit = true;
    if (this.sagaForm.valid) {
      const controls = this.sagaForm.controls;
      this.loadingController.create({
        message: 'Sauvegarde en cours...'
      }).then((loading) => {
        loading.present();

        // Fields from form
        let saga = new SagaModel();
        saga.title = controls['title'].value;
        saga.url = controls['url'].value;
        saga.urlWiki = controls['urlWiki'].value;
        saga.status = controls['status'].value;
        saga.synopsis = controls['synopsis'].value;
        saga.origin = controls['origin'].value;
        saga.genese = controls['genese'].value;
        saga.awards = controls['awards'].value;

        // Fields from DB
        saga.id = this.saga.id;
        saga.startDate = this.saga.startDate;
        saga.duration = this.saga.duration;
        saga.levelArt = this.saga.levelArt;
        saga.levelTech = this.saga.levelTech;
        saga.nbReviews = this.saga.nbReviews;
        saga.urlReviews = this.saga.urlReviews;
        saga.nbBravos = this.saga.nbBravos;
        saga.workspace = this.saga.workspace;

        if (controls['bannerSource'].value && controls['coverSource'].value) {
          const banner = this.fileService.upload(controls['bannerSource'].value, "sagas/" + this.saga.workspace + "/images", "banner");
          const cover = this.fileService.upload(controls['coverSource'].value, "sagas/" + this.saga.workspace + "/images", "cover");
          forkJoin([banner, cover])
            .pipe(map(responses => {
              saga.bannerUrl = responses[0].url;
              saga.coverUrl = responses[1].url;
              this.updateSaga(loading, saga);
            }))
            .subscribe();
        } else if (controls['bannerSource'].value && !controls['coverSource'].value) {
          this.fileService.upload(controls['bannerSource'].value, "sagas/" + this.saga.workspace + "/images", "banner")
            .subscribe({
              next: (data) => {
                saga.bannerUrl = data.url;
                saga.coverUrl = this.saga.coverUrl;
                this.updateSaga(loading, saga);
              }
            });
        } else if (!controls['bannerSource'].value && controls['coverSource'].value) {
          this.fileService.upload(controls['coverSource'].value, "sagas/" + this.saga.workspace + "/images", "cover")
            .subscribe({
              next: (data) => {
                saga.bannerUrl = this.saga.bannerUrl;
                saga.coverUrl = data.url;
                this.updateSaga(loading, saga);
              }
            });
        } else {
          saga.bannerUrl = this.saga.bannerUrl;
          saga.coverUrl = this.saga.coverUrl;
          this.updateSaga(loading, saga);
        }

        loading.dismiss();
      });
    } else {
      this.markFieldsDirty();
    }
  }

  onBannerChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.size <= this.fileService.maxFileSize) {
        this.sagaForm.patchValue({
          bannerSource: file
        });
        this.bannerSource = file.name;
      }
    }
  }

  onCoverChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.size <= this.fileService.maxFileSize) {
        this.sagaForm.patchValue({
          coverSource: file
        });
        this.coverSource = file.name;
      }
    }
  }

}

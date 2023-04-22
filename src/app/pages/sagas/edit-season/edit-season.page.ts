import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { Saga } from 'src/app/entities/saga';
import { Season } from 'src/app/entities/season';
import { SeasonModel } from 'src/app/models/season.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { SagaService } from 'src/app/services/sagas/saga.service';
import { SeasonService } from 'src/app/services/seasons/season.service';

@Component({
  selector: 'app-edit-season',
  templateUrl: './edit-season.page.html',
  styleUrls: ['./edit-season.page.scss'],
})
export class EditSeasonPage implements OnInit {

  public saga: Saga = new Saga();
  public season: Season = new Season();

  seasonForm: FormGroup;
  attemptedSubmit = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public authService: AuthService,
    public configService: ConfigService,
    public sagaService: SagaService,
    public seasonService: SeasonService) {
    this.seasonForm = this.fb.group({
      number: [0, [Validators.required]],
      name: ['']
    });
  }

  ngOnInit() {
    var sagaId: number = +this.activatedRoute.snapshot.paramMap.get('sagaId')!;
    var seasonId: number = +this.activatedRoute.snapshot.paramMap.get('seasonId')!;
    this.loadingController.create({
      message: 'Téléchargement...'
    }).then((loading) => {
      loading.present();
      let saga = this.sagaService.getById(sagaId);
      let season = this.seasonService.getById(seasonId);
      forkJoin([saga, season]).subscribe(results => {
        this.saga = Saga.fromModel(results[0]);
        this.season = Season.fromModel(results[1]);
        const controls = this.seasonForm.controls;
        controls['number'].setValue(this.season.number);
        controls['name'].setValue(this.season.name);
        loading.dismiss();
      });
    });
  }

  markFieldsDirty() {
    const controls = this.seasonForm.controls;
    for (const field in controls) {
      if (controls[field]) {
        controls[field].markAsDirty();
      }
    }
  }

  async save() {
    this.attemptedSubmit = true;
    if (this.seasonForm.valid) {      
      const controls = this.seasonForm.controls;
      this.loadingController.create({
        message: 'Sauvegarde en cours...'
      }).then((loading) => {
        loading.present();
        let season = new SeasonModel();
        season.id = this.season.id;
        season.sagaRef = this.season.sagaRef;
        season.number = controls['number'].value;
        season.name = controls['name'].value;
        this.seasonService.update(season)
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
      });
    } else {
      this.markFieldsDirty();
    }
  }
}

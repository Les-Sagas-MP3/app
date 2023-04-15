import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { Category } from 'src/app/entities/category';
import { Saga } from 'src/app/entities/saga';
import { Season } from 'src/app/entities/season';
import { AuthorService } from 'src/app/services/authors/author.service';
import { CategoryService } from 'src/app/services/categories/category.service';
import { SagaService } from 'src/app/services/sagas/saga.service';
import { SeasonService } from 'src/app/services/seasons/season.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SeasonModel } from 'src/app/models/season.model';

@Component({
  selector: 'app-view-saga',
  templateUrl: './view-saga.page.html',
  styleUrls: ['./view-saga.page.scss'],
})
export class ViewSagaPage implements OnInit {

  public item: Saga = new Saga();
  private lastSeasonNumber = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    public loadingController: LoadingController,
    private navCtrl: NavController,
    public authService: AuthService,
    public authorService: AuthorService,
    public configService: ConfigService,
    public categoryService: CategoryService,
    private sagaService: SagaService,
    private seasonService: SeasonService) { }

  ngOnInit() {
    var itemId: number = +this.activatedRoute.snapshot.paramMap.get('id')!;
    this.loadingController.create({
      message: 'Téléchargement...'
    }).then((loading) => {
      loading.present();
      this.sagaService.getById(itemId)
        .subscribe(data => {
          this.item = Saga.fromModel(data);
          let categories = this.categoryService.getAllByIds(data.categoriesRef);
          let authors = this.authorService.getAllByIds(data.authorsRef);
          let seasons = this.seasonService.getAllByIds(data.seasonsRef);
          forkJoin([authors, categories, seasons]).subscribe(results => {
            this.item.authors = results[0];
            this.item.categories = Category.fromModels(results[1]);
            this.item.seasons = Season.fromModels(results[2]).sort((first, second) => 0 - (first.number > second.number ? -1 : 1));
            loading.dismiss();
          });
        });
    });
  }

  bannerUrl(): any {
    if(this.item.bannerUrl) {
      return {'background-image': 'url(' + this.configService.get('apiUrl') + "/files/image" + this.item.bannerUrl + ')'}
    } else {
      return '';
    }
  }

  coverUrl(): string {
    if(this.item.coverUrl) {
      return this.configService.get('apiUrl') + "/files/image" + this.item.coverUrl;
    } else {
      return '';
    }
  }

  addSeason() {
    var season = new SeasonModel();
    if(this.item.seasons.length > 0) {
      season.number = this.item.seasons[this.item.seasons.length - 1].number + 1;
    }
    season.sagaRef = this.item.id;
    this.seasonService.create(season)
      .subscribe(data => {
        this.navCtrl.navigateForward(`sagas/${this.item.id}/seasons/${data.id}/edit`);        
      });
  }

}

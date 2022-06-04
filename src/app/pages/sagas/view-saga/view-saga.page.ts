import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { Category } from 'src/app/entities/category';
import { Saga } from 'src/app/entities/saga';
import { Season } from 'src/app/entities/season';
import { AuthorService } from 'src/app/services/authors/author.service';
import { CategoryService } from 'src/app/services/categories/category.service';
import { SagaService } from 'src/app/services/sagas/saga.service';
import { SeasonService } from 'src/app/services/seasons/season.service';
import { ConfigService } from 'src/app/services/config/config.service';

@Component({
  selector: 'app-view-saga',
  templateUrl: './view-saga.page.html',
  styleUrls: ['./view-saga.page.scss'],
})
export class ViewSagaPage implements OnInit {

  public item: Saga = new Saga();

  constructor(
    private activatedRoute: ActivatedRoute,
    public loadingController: LoadingController,
    public authorService: AuthorService,
    public configService: ConfigService,
    public categoryService: CategoryService,
    private sagaService: SagaService,
    private seasonService: SeasonService) { }

  ngOnInit() {
    var itemId: number = +this.activatedRoute.snapshot.paramMap.get('id');
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
            this.item.seasons = Season.fromModels(results[2]);
            loading.dismiss();
          });
        });
    });
  }

  bannerUrl(): string {
    if(this.item.bannerUrl) {
      return 'url(' + this.configService.get('appUrl') + this.item.bannerUrl + ')';
    } else {
      return '';
    }
  }

  coverUrl(): string {
    if(this.item.coverUrl) {
      return this.configService.get('appUrl') + this.item.coverUrl;
    } else {
      return '';
    }
  }

}

import { SagaModel } from '../models/saga.model';
import { Author } from './author';
import { Category } from './category';
import { Season } from './season';

export class Saga extends SagaModel {
    
    authors: Author[] = []
    categories: Category[] = []
    seasons: Season[] = []

    static fromModel(model: SagaModel): Saga {
        var entity = new Saga();
        entity.id = model.id;
        entity.createdAt = model.createdAt;
        entity.createdBy = model.createdBy;
        entity.updatedAt = model.updatedAt;
        entity.updatedBy = model.updatedBy;
        entity.title = model.title;
        entity.status = model.status;
        entity.startDate = model.startDate;
        entity.duration = model.duration;
        entity.synopsis = model.synopsis;
        entity.origin = model.origin;
        entity.genese = model.genese;
        entity.awards = model.awards;
        entity.bannerUrl = model.bannerUrl;
        entity.coverUrl = model.coverUrl;
        entity.url = model.url;
        entity.urlWiki = model.urlWiki;
        entity.levelArt = model.levelArt;
        entity.levelTech = model.levelTech;
        entity.nbReviews = model.nbReviews;
        entity.urlReviews = model.urlReviews;
        entity.nbBravos = model.nbBravos;
        entity.authorsRef = model.authorsRef;
        entity.composersRef = model.composersRef;
        entity.categoriesRef = model.categoriesRef;
        entity.seasonsRef = model.seasonsRef;
        entity.distributionEntriesRef = model.distributionEntriesRef;
        entity.anecdotesRef = model.anecdotesRef;
        return entity;
    }

    static fromModels(models: SagaModel[]): Saga[] {
        var entities: Saga[] = [];
        models.forEach(model => entities.push(this.fromModel(model)));
        return entities;
    }

}

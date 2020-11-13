import { SeasonModel } from '../models/season.model';
import { Saga } from './saga';

export class Season extends SeasonModel {
    
    saga: Saga;

    static fromModel(model: SeasonModel): Season {
        var entity = new Season();
        entity.id = model.id;
        entity.createdAt = model.createdAt;
        entity.createdBy = model.createdBy;
        entity.updatedAt = model.updatedAt;
        entity.updatedBy = model.updatedBy;
        entity.number = model.number;
        entity.name = model.name;
        entity.sagaRef = model.sagaRef;
        entity.episodesRef = model.episodesRef;
        return entity;
    }

    static fromModels(models: SeasonModel[]): Season[] {
        var entities: Season[] = [];
        models.forEach(model => entities.push(this.fromModel(model)));
        return entities;
    }

}

import { EpisodeModel } from '../models/episode.model';
import { Season } from './season';

export class Episode extends EpisodeModel {
    
    season: Season;

    static fromModel(model: EpisodeModel): Episode {
        var entity = new Episode();
        entity.id = model.id;
        entity.createdAt = model.createdAt;
        entity.createdBy = model.createdBy;
        entity.updatedAt = model.updatedAt;
        entity.updatedBy = model.updatedBy;
        entity.number = model.number;
        entity.displayedNumber = model.displayedNumber;
        entity.title = model.title;
        entity.infos = model.infos;
        entity.seasonRef = model.seasonRef;
        return entity;
    }

    static fromModels(models: EpisodeModel[]): Episode[] {
        var entities: Episode[] = [];
        models.forEach(model => entities.push(this.fromModel(model)));
        return entities;
    }

}

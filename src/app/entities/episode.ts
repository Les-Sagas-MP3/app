import { EpisodeModel } from '../models/episode.model';
import { File } from './file';
import { Season } from './season';

export class Episode extends EpisodeModel {
    
    season: Season;
    file: File;

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
        entity.workspace = model.workspace;
        entity.season = new Season();
        entity.season.id = model.seasonRef;
        entity.seasonRef = model.seasonRef;
        entity.file = new File();
        entity.file.id = model.fileRef;
        entity.fileRef = model.fileRef;
        return entity;
    }

    static fromModels(models: EpisodeModel[]): Episode[] {
        var entities: Episode[] = [];
        models.forEach(model => entities.push(this.fromModel(model)));
        return entities;
    }

}

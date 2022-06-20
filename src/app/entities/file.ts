import { FileModel } from "../models/file.model";

export class File extends FileModel {
    
    static fromModel(model: FileModel): File {
        var entity = new File();
        entity.id = model.id;
        entity.createdAt = model.createdAt;
        entity.createdBy = model.createdBy;
        entity.updatedAt = model.updatedAt;
        entity.updatedBy = model.updatedBy;
        entity.url = model.url;
        return entity;
    }

}

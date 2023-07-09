import { UserModel } from "src/app/models/user/user.model";

export class User extends UserModel {
    
    static fromModel(model: UserModel): User {
        var entity = new User();
        entity.id = model.id;
        entity.createdAt = model.createdAt;
        entity.createdBy = model.createdBy;
        entity.updatedAt = model.updatedAt;
        entity.updatedBy = model.updatedBy;
        entity.username = model.username;
        entity.password = model.password;
        entity.email = model.email;
        entity.enabled = model.enabled;
        entity.lastPasswordResetDate = model.lastPasswordResetDate;
        entity.avatarUrl = model.avatarUrl;
        entity.workspace = model.workspace;
        return entity;
    }

    static fromModels(models: UserModel[]): User[] {
        var entities: User[] = [];
        models.forEach(model => entities.push(this.fromModel(model)));
        return entities;
    }

}

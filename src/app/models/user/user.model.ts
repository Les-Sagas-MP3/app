import { AuditModel } from "../audit.model";

export class UserModel extends AuditModel {
    
    username: string = '';
    password: string = '';
    email: string = '';
    enabled: boolean = false;
    lastPasswordResetDate: Date = new Date();
    avatarUrl: string = '';
    workspace: string = '';

}

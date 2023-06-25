import { AuditModel } from '../audit.model';

export class RoleModel extends AuditModel {

    name: string = 'MEMBER';
    userRef: number = 0;
    sagaRef: number = 0;

}

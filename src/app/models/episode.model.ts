import { AuditModel } from './audit.model';

export class EpisodeModel extends AuditModel {

    number: number = 1;
    displayedNumber: string = '1';
    title: string = '';
    infos: string = '';
    seasonRef: number = 0;

}

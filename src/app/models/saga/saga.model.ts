import { AuditModel } from '../audit.model';

export class SagaModel extends AuditModel {

    title: string = '';
    status: string = '';
    startDate: Date = new Date();
    duration: number = 0;
    synopsis: string = '';
    origin: string = '';
    genese: string = '';
    awards: string = '';
    bannerUrl: string = '';
    coverUrl: string = '';
    url: string = '';
    urlWiki: string = '';
    levelArt: number = 100;
    levelTech: number = 100;
    nbReviews: number = 0;
    urlReviews: string = '';
    nbBravos: number = 0;
    workspace: string = '';
    authorsRef: number[] = [];
    composersRef: number[] = [];
    categoriesRef: number[] = [];
    seasonsRef: number[] = [];
    distributionEntriesRef: number[] = [];
    anecdotesRef: number[] = [];

}

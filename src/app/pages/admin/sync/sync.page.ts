import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { EventLogModel } from 'src/app/models/eventlog.model';
import { EventLogService } from 'src/app/services/eventlog/eventlog.service';
import { SyncService } from 'src/app/services/sync/sync.service';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.page.html',
  styleUrls: ['./sync.page.scss'],
})
export class SyncPage implements OnInit {

  lastSyncNews: EventLogModel = new EventLogModel();
  lastSyncSagas: EventLogModel = new EventLogModel();

  constructor(
    private loadingController: LoadingController,
    private eventLogService: EventLogService,
    private syncService: SyncService) { }

  ngOnInit() {
    this.loadingController.create({
      message: 'Téléchargement...'
    }).then((loading) => {
      loading.present();
      let syncNewsRequest = this.eventLogService.getLatestByName("SYNC_NEWS_START");
      let syncSagasRequest = this.eventLogService.getLatestByName("SYNC_SAGAS_START");
      forkJoin([syncNewsRequest, syncSagasRequest])
      .subscribe({
        next: (results) => {
          this.lastSyncNews = results[0];
          this.lastSyncSagas = results[1];
          loading.dismiss();
        },
        error: error => {
          console.error(error);
          loading.dismiss();
        }
      });
    });
  }

  doRefresh(event: any) {
    let syncNewsRequest = this.eventLogService.getLatestByName("SYNC_NEWS_START");
    let syncSagasRequest = this.eventLogService.getLatestByName("SYNC_SAGAS_START");
    forkJoin([syncNewsRequest, syncSagasRequest]).subscribe(results => {
      this.lastSyncNews = results[0];
      this.lastSyncSagas = results[1];
      event.target.complete();
    }, error => {
      event.target.complete();
    });
  }
  
  syncNews() {
    this.syncService.syncNews()
      .subscribe(res => {});
  }

  syncSagas() {
    this.syncService.syncSagas()
      .subscribe(res => {});
  }

}

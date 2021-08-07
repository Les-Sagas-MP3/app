import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor() { }

  initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.initFCM();
    }
  }

  private async initFCM() {

    await PushNotifications.requestPermissions();
    await PushNotifications.register();
    
  }
}

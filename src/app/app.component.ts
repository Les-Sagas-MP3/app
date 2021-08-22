import { Component, OnInit } from '@angular/core';

import { NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthService } from './services/auth/auth.service';
import { FcmService } from './services/fcm/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  appPages = [
    {
      title: 'Actualités',
      url: '/news',
      icon: 'newspaper'
    },
    {
      title: 'Liste des Sagas',
      url: '/sagas',
      icon: 'list'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcmService: FcmService,
    private navCtrl: NavController,
    public authService: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.fcmService.initPush();
    });
  }

  ngOnInit() {
    this.authService.whoami();
  }

  logout() {
    localStorage.setItem('jwt', null);
    this.authService.currentTokenValue = null;
    localStorage.setItem('user', null);
    this.authService.currentUserValue = null;
    this.navCtrl.navigateRoot('/news');
  }
}

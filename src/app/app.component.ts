import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { FcmService } from './services/fcm/fcm.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, RouterLinkActive, CommonModule],
})
export class AppComponent {
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
    private navCtrl: NavController,
    private fcmService: FcmService,
    public authService: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.fcmService.initPush();
    });
  }

  ngOnInit() {
    this.authService.whoami();
  }

  logout() {
    this.authService.logout();
    this.navCtrl.navigateRoot('/news');
  }

  get isAdmin() {
    return this.authService.isAdmin;
  }
}

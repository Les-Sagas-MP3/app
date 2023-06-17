import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/users/user.service';
import { User } from 'src/app/entities/user/user';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.page.html',
  styleUrls: ['./list-users.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ListUsersPage implements OnInit {

  public items: User[] = [];
  public isSearchRunning: boolean = false;
  private numPage: number = 0;
  private sizePage: number = 30;

  constructor(
    public loadingController: LoadingController,
    public authService: AuthService,
    private userService: UserService) { }

  ngOnInit() {
    this.loadingController.create({
      message: 'Téléchargement...'
    }).then((loading) => {
      loading.present();
      this.userService.getPaginated(this.numPage, this.sizePage).subscribe(results => {
        this.items = User.fromModels(results.content);
        loading.dismiss();
      });
    });
  }

  search(event: Event) {
    let searchInput = (event.target as HTMLInputElement).value;
    if (searchInput.length > 2) {
      this.isSearchRunning = true;
      this.userService.search(searchInput)
        .subscribe(res => {
          this.items = User.fromModels(res);
        });
    }
  }

  cancelSearch() {
    this.isSearchRunning = false;
    this.userService.getPaginated(this.numPage, this.sizePage)
      .subscribe(res => {
        this.items = User.fromModels(res.content);
      });
  }

  loadData(event: any) {
    this.numPage++;
    this.userService.getPaginated(this.numPage, this.sizePage)
      .subscribe(res => {
        var users = User.fromModels(res.content);
        users.forEach(saga => this.items.push(saga));
        event.target.complete();
        if (this.numPage == res.totalPages) {
          event.target.disabled = true;
        }
      });
  }


}

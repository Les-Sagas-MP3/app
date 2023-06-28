import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ConfigService } from 'src/app/services/config/config.service';
import { UserService } from 'src/app/services/users/user.service';
import { User } from 'src/app/entities/user/user';
import { RoleService } from 'src/app/services/role/role.service';
import { UserModel } from 'src/app/models/user/user.model';
import { forkJoin } from 'rxjs';
import { RoleModel } from 'src/app/models/role/role.model';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.page.html',
  styleUrls: ['./view-user.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class ViewUserPage implements OnInit {

  public user: User = new User();
  public roles: RoleModel[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    public loadingController: LoadingController,
    public configService: ConfigService,
    public roleService: RoleService,
    public userService: UserService) { }

  ngOnInit() {
    var itemId: number = +this.activatedRoute.snapshot.paramMap.get('id')!;
    this.loadingController.create({
      message: 'Téléchargement...'
    }).then((loading) => {
      loading.present();
      let user = this.userService.getById(itemId);
      let roles = this.roleService.getAllByUserId(itemId);
      forkJoin([user, roles]).subscribe({
        next: (data) => {
          this.user = User.fromModel(data[0]);
          this.roles = data[1];
          loading.dismiss();
        },
        error: () => {
          loading.dismiss();
        }
      })
    });
  }

}

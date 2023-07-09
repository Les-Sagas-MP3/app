import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, LoadingController, NavController } from '@ionic/angular';
import { User } from 'src/app/entities/user/user';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { FileService } from 'src/app/services/file/file.service';
import { UserService } from 'src/app/services/users/user.service';
import { UserModel } from 'src/app/models/user/user.model';
import { RoleService } from 'src/app/services/role/role.service';
import { forkJoin } from 'rxjs';
import { RoleModel } from 'src/app/models/role/role.model';
import { RoleName } from 'src/app/models/role/role.name';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class EditUserPage implements OnInit {

  public user: User = new User();
  public roles: RoleModel[] = [];
  public selectableRoles: string[] = [];

  userForm: FormGroup;
  attemptedSubmit = false;
  avatarSource = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public authService: AuthService,
    public configService: ConfigService,
    private fileService: FileService,
    private roleService: RoleService,
    private userService: UserService) {
      this.userForm = this.fb.group({
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.minLength(6)]],
        avatar: [''],
        avatarSource: ['']
      });
    }

    ngOnInit() {
      var userId: number = +this.activatedRoute.snapshot.paramMap.get('id')!;
      this.loadingController.create({
        message: 'Téléchargement...'
      }).then((loading) => {
        loading.present();
        let user = this.userService.getById(userId);
        let roles = this.roleService.getAllByUserId(userId);
        forkJoin([user, roles]).subscribe({
          next: (data) => {
            this.user = User.fromModel(data[0]);
            const controls = this.userForm.controls;
            controls['username'].setValue(this.user.username);
            controls['email'].setValue(this.user.email);
            controls['password'].setValue("");
            loading.dismiss();
            this.roles = data[1];
            for (let role in RoleName) {
              if(this.roles.find(affectedRole => affectedRole.name == role) === undefined) {
                this.selectableRoles.push(role);
              }
            }
            loading.dismiss();
          },
          error: () => {
            loading.dismiss();
          }
        });
      });
    }
  
    markFieldsDirty() {
      const controls = this.userForm.controls;
      for (const field in controls) {
        if (controls[field]) {
          controls[field].markAsDirty();
        }
      }
    }
  
    updateUser(loading: HTMLIonLoadingElement, user: UserModel) {
      this.userService.update(user)
        .subscribe({
          next: () => {
            loading.dismiss();
            this.navCtrl.navigateForward("admin/users/" + this.user.id)
          },
          error: error => {
            console.error(error);
            loading.dismiss();
          }
        });
    }
  
    async save() {
      this.attemptedSubmit = true;
      if (this.userForm.valid) {
        const controls = this.userForm.controls;
        this.loadingController.create({
          message: 'Sauvegarde en cours...'
        }).then((loading) => {
          loading.present();
  
          // Fields from form
          let user = new UserModel();
          user.username = controls['username'].value;
          user.email = controls['email'].value;
          user.password = controls['password'].value;
  
          // Fields from DB
          user.id = this.user.id;
          user.enabled = this.user.enabled;
          user.lastPasswordResetDate = this.user.lastPasswordResetDate;
          user.workspace = this.user.workspace;
  
          if (controls['avatarSource'].value) {
            this.fileService.upload(controls['avatarSource'].value, "users/" + this.user.workspace + "/images", "avatar")
              .subscribe({
                next: (data) => {
                  user.avatarUrl = data.url;
                  this.updateUser(loading, user);
                }
              });
          } else {
            user.avatarUrl = this.user.avatarUrl;
            this.updateUser(loading, user);
          }
  
          loading.dismiss();
        });
      } else {
        this.markFieldsDirty();
      }
    }
  
    onAvatarChange(event: any) {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        if (file.size <= this.fileService.maxFileSize) {
          this.userForm.patchValue({
            avatarSource: file
          });
          this.avatarSource = file.name;
        }
      }
    }

    deletePermission(roleId: number) {
      this.roleService.delete(roleId)
        .subscribe({
          next: () => {
            this.ngOnInit();
          }
        });
    }
  
}

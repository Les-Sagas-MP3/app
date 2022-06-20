import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  isLogin = false;
  attemptedSubmit = false;

  errorMessages = {
    required: '{$1} required',
    minlength: 'At least 6 characters required',
    email: 'Invalid email address'
  };

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private toastController: ToastController,
    private authService: AuthService) {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
  }

  ngOnInit() {
    if(this.authService.currentTokenValue) {
      this.navCtrl.navigateRoot('/news');
    }
  }

  markFieldsDirty() {
    const controls = this.loginForm.controls;
    for (const field in controls) {
      if (controls[field]) {
        controls[field].markAsDirty();
      }
    }
  }

  async logIn() {
    this.attemptedSubmit = true;
    const toast = await this.toastController.create({
      duration: 2000,
      color: 'warning'
    });
    if (this.loginForm.valid) {      
      const controls = this.loginForm.controls;
      this.loadingController.create({
        message: 'Connexion en cours...'
      }).then((loading) => {
        loading.present();
        this.authService.login(controls['email'].value, controls['password'].value)
          .subscribe(res => {
            if(res && res.token) {
              localStorage.setItem('jwt', JSON.stringify(res));
              this.authService.currentTokenValue = res;
              this.loginForm.reset();
              this.authService.whoami();
              loading.dismiss();
              this.navCtrl.navigateRoot('/news');
            }
            this.attemptedSubmit = false;
          }, error => {
            if(error.status == 401) {
              toast.message = "Identifiants incorrects"
              toast.present();
            }
            this.attemptedSubmit = false;
            this.markFieldsDirty();
            loading.dismiss();
          });
      });
    } else {
      this.markFieldsDirty();
    }
  }

  errorFor(fieldName: string) {
    const field = this.loginForm.controls[fieldName];
    for (const validator in field.errors) {
      if (field.errors[validator]) {
        const friendlyName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        return this.errorMessages[validator].replace('{$1}', friendlyName);
      }
    }
    return null;
  }

}

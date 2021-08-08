import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  signupForm: FormGroup;
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
    this.signupForm = this.fb.group({
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
    const controls = this.signupForm.controls;
    for (const field in controls) {
      if (controls[field]) {
        controls[field].markAsDirty();
      }
    }
  }

  async signup() {
    this.attemptedSubmit = true;
    const toast = await this.toastController.create({
      duration: 2000,
      color: 'warning'
    });
    if (this.signupForm.valid) {      
      const controls = this.signupForm.controls;
      this.loadingController.create({
        message: 'Enregistrement en cours...'
      }).then((loading) => {
        loading.present();
        this.authService.signup(controls['email'].value, controls['password'].value)
          .subscribe(res => {
            this.signupForm.reset();
            loading.dismiss();
            this.navCtrl.navigateRoot('/news');
            this.attemptedSubmit = false;
          }, error => {
            toast.message = "Erreur lors de l'enregistrement"
            toast.present();
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
    const field = this.signupForm.controls[fieldName];
    for (const validator in field.errors) {
      if (field.errors[validator]) {
        const friendlyName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        return this.errorMessages[validator].replace('{$1}', friendlyName);
      }
    }
    return null;
  }
}

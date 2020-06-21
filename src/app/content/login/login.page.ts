import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  loader:any;
  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    public loadingCtrl: LoadingController,
    // public toastController: ToastController,
    // private storage: Storage,
    // private navCtrl: NavController
  ) { 
    this.loginForm = this.formBuilder.group({
      email: ['example@email.com', [Validators.required, emailValid()]],
      password: ['12345678', [Validators.minLength(8), Validators.required]],
    });
  }

  ngOnInit() {
  }

  register() {
    this.router.navigate(['/register'])
  }

}


function emailValid() {
  return control => {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(control.value) ? null : { invalidEmail: true }
  }
}
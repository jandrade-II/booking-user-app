import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { UserService } from 'src/app/shared/services/user.service';
import { Subject } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast.service';
import { takeUntil } from 'rxjs/operators';
import { ErrorMsg } from 'src/app/shared/model/error';
import { UserInfo } from 'src/app/shared/model/user';
import { key_name } from 'src/app/shared/model/constants';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  destroySubject$: Subject<void> = new Subject();

  loginForm: FormGroup;

  loader:any = null

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private userServe: UserService,
    private toastServe: ToastService,
    private storage: Storage,

  ) { 
    this.loginForm = this.formBuilder.group({
      email: ['example@email.com', [Validators.required, emailValid()]],
      password: ['12345678', [Validators.minLength(8), Validators.required]],
    });
  }

  ngOnInit() {
    this.getSubscriber();
  }

  async loadingDialog(message:string) {
    const loader = await this.loadingCtrl.create({
      message: message,
      spinner: 'dots',
    })
    return loader;
  }


  async login() {
    if(this.loginForm.valid) {
      this.loader = await this.loadingDialog('Logging in!...')
      await this.loader.present();
      this.userServe.login(this.loginForm.value)
    } else {
      this.toastServe.presentToast('Invalid Form', 'bottom', 'warning')
    }
  }

  async getSubscriber() {
    this.userServe.getUser()
     .asObservable()
     .pipe(
       takeUntil(this.destroySubject$)
     )
     .subscribe(async (user: UserInfo)=>{
       await this.dismissAllLoaders()
       if(user) {
         this.storage.set(key_name.user, user);
         this.toastServe.presentToast('Yay! Successfully login', 'bottom', 'success')
         this.navCtrl.setDirection('root');
         this.goToPage('/home');
       } else {
       }
     })
 
     // this.subs.push(sub0)
 
    this.userServe.getErrorMsg()
     .asObservable()
     .pipe(
       takeUntil(this.destroySubject$)
     )
     .subscribe(async(errorMsg: ErrorMsg)=>{
       await this.dismissAllLoaders()
       if(Object.keys(errorMsg).length > 0) {
         this.toastServe.presentToast(errorMsg.message, 'bottom', 'danger' )
         this.userServe.setErrorMsg({});
       }
     })
  }

  register() {
    this.navCtrl.navigateForward('/register')
  }

  goToPage(page) {
    this.router.navigate([page])
  }

  async dismissAllLoaders() {
    const whilePromise = (
      condition: () => Promise<boolean>,
      action: () => Promise<boolean>
    ) => {
      condition().then(value => {
        if (value) {
          action().then(closed => {
            if (closed) {
              whilePromise(condition, action);
            } else {
            }
          });
        }
      });
    };


    whilePromise(
      () => this.loadingCtrl.getTop().then(topLoader => topLoader != null),
      () => this.loadingCtrl.dismiss()
    );
  }


  ionViewDidLeave() {
     
  }

  ngOnDestroy() {
    this.destroySubject$.next();
    this.destroySubject$.complete();
    this.destroySubject$.unsubscribe();
  }

}


function emailValid() {
  return control => {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(control.value) ? null : { invalidEmail: true }
  }
}
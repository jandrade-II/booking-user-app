import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { UserService } from 'src/app/shared/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserInfo } from 'src/app/shared/model/user';
import { Storage } from '@ionic/storage';
import { key_name } from 'src/app/shared/model/constants';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ErrorMsg } from 'src/app/shared/model/error';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {
  destroySubject$: Subject<void> = new Subject();
  registerForm: FormGroup;

  loader:any = null

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    public loadingCtrl: LoadingController,
    private userServe: UserService,
    private storage: Storage,
    private toastServe: ToastService,
    private navCtrl: NavController,

  ) { 
    this.registerForm = this.formBuilder.group({
      email: ['example@email.com', [Validators.required, emailValid()]],
      contactNo: ['', [Validators.minLength(8), Validators.required]],
      firstName: ['', [Validators.minLength(3), Validators.required]],
      lastName: ['', [Validators.minLength(3), Validators.required]],
      address: ['', [Validators.minLength(3), Validators.required]],
      password:  ['', [Validators.minLength(3), Validators.required]],
      confirmPassword:  ['', [Validators.minLength(3), Validators.required]],
    }, { validator: matchingFields('password', 'confirmPassword') });
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



  async register() {

    if(this.registerForm.valid) {
      this.loader = await this.loadingDialog('Registering User!...')
      await this.loader.present();
      this.userServe.register(this.registerForm.value)
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
         this.toastServe.presentToast('Yay! Successfully Register', 'bottom', 'success')
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
         console.log('errorMsg:', errorMsg)
         this.toastServe.presentToast(errorMsg.message, 'bottom', 'danger' )
       }
     })
     

   }

  login() {
    this.router.navigate(['/login'])
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

function matchingFields(field1, field2) {
  return form => {
    if (form.controls[field1].value !== form.controls[field2].value) {
      return { mismatchedFields: true };
    }
  };
}

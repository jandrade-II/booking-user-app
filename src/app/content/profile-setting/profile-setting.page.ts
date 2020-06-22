import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserInfo } from 'src/app/shared/model/user';
import { UserService } from 'src/app/shared/services/user.service';
import { takeUntil } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { key_name } from 'src/app/shared/model/constants';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.page.html',
  styleUrls: ['./profile-setting.page.scss'],
})
export class ProfileSettingPage implements OnInit {
  destroySubject$: Subject<void> = new Subject();

  private user: UserInfo = null;

  constructor(
    private userServe: UserService,
    private storage: Storage,
    private router: Router,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.userServe.getUser().asObservable()
    .pipe(
      takeUntil(this.destroySubject$)
    ).subscribe((user: UserInfo)=>{
      this.user = user;
      console.log(this.user)
    })
  }


  async logout() {
       this.userServe.setUser(null);
       this.userServe.setErrorMsg({})
       this.storage.remove(key_name.user);
       this.navCtrl.setDirection('root');
       this.goToPage('/login')

  }

  goToPage(page) {
    this.router.navigate([page])
  }


  ionViewDidLeave() {
    this.destroySubject$.next();
    this.destroySubject$.complete();
    this.destroySubject$.unsubscribe();
  }


}

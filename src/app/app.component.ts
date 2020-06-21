import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs';
import { key_name } from './shared/model/constants';
import { UserInfo } from './shared/model/user';
import { UserService } from './shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  destroySubject$: Subject<void> = new Subject();
 
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private userServe: UserService,
    private router: Router,

  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storage.get(key_name.user).then((val:UserInfo)=>{
        if(val) {
          this.userServe.setUser(val)
          this.router.navigate(["/home"]);
        } else {
          this.router.navigate(["/login"]);
        }
      })
    });
  }
}

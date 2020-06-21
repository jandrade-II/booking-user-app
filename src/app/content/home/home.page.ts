import { Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { UserInfo } from 'src/app/shared/model/user';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private userServe: UserService
  ) {

    let user:UserInfo= this.userServe.getUser().value;

    console.log('user:', user)
  }

}

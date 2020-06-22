import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { UserInfo } from 'src/app/shared/model/user';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  destroySubject$: Subject<void> = new Subject();

  constructor(
    private userServe: UserService,
    private router: Router
  ) {

  
  }

  ngOnInit() {
    this.userServe.getUser().asObservable()
    .pipe(
      takeUntil(this.destroySubject$)
    ).subscribe((user: UserInfo)=>{
      if(user) {
        console.log('user:', user)
      }
    });
  }

  goToPage(page) {
    this.router.navigate([page])
  }

  ionViewDidLeave() {
    this.destroySubject$.next();
    this.destroySubject$.complete(); 
  }

}

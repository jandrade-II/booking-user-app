import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, of, combineLatest } from 'rxjs';
import { map, switchMap, take, tap, retryWhen } from 'rxjs/operators';
import { ErrorMsg } from '../model/error';  
import { UserInfo, Creds } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userCollection: AngularFirestoreCollection<UserInfo>;
  private user = new BehaviorSubject<UserInfo>(null);
  private errorMsg = new BehaviorSubject<ErrorMsg>({});

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
  ) { 
    this.userCollection =  this.afs.collection('users');

    this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.collection('users').doc(user.uid).valueChanges();
        } else {
          return of(null)
        }
      })
    )
  }

  async login(creds: Creds) {
    await this.afAuth.auth.signInWithEmailAndPassword(creds.email, creds.password).then(async (result)=>{
        this.authenticate(result.user)
    }).catch((err)=>{
      this.createErrorMsg('Error Message', err.message)
      console.log("error: ", err)
    })
  }

  authenticate(user: firebase.User) {
    this.userCollection.doc(user.uid)
      .valueChanges().subscribe((res:any)=>{
        if(res) {
          if(/*adminuser.emailVerified*/ true) {
            // res.id = adminuser.uid;
            // this.spaUser.next(res);
          } else {
            this.createErrorMsg('Warning Message', 'Email is not verified');
          }
        } else {
          this.createErrorMsg('Error Message', 'No user found with the inputted email and password!');

        }
      
    },(err)=>{
      this.createErrorMsg('Error Message', err.message);
    })
  }

  async register(user: UserInfo) {
    let that = this;
     this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password).then(async (result)=>{
        user.userId = result.user.uid;
        that.userCollection.doc(user.userId).set(user)
        .then(async ()=>{
          that.user.next(user)
        })
        .catch((err)=>{
          console.log(err)
          that.createErrorMsg('Error Message', err.message)
        });
      }).catch((err)=>{
        this.createErrorMsg('Error Message', err.message)
      })
  }

  
  createErrorMsg(errorTitle, errorMsg) {
    let error = {} as ErrorMsg;
    error.title = errorTitle;
    error.message = errorMsg;
    this.errorMsg.next(error)
  }

  getUser(){
    return this.user;
  }
  
  getErrorMsg() {
    return this.errorMsg
  }

  setUser(user: UserInfo) {
    this.user.next(user)
  }



}

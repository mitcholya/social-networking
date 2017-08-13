import { Injectable } from '@angular/core';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from "@angular/router";
import * as firebase from 'firebase';
import { LoginComponent } from '../components/login/login.component';
import { LocalStorageService } from 'angular-2-local-storage';




@Injectable()
export class AuthService {

  authState: any = null;

  constructor(public afAuth: AngularFireAuth,
              private db: AngularFireDatabase,
              private router:Router,
              private localStorageService: LocalStorageService,
            ) {

            this.afAuth.authState.subscribe((auth) => {
              this.authState = auth
            });
          }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  // Returns
  get currentUserObservable(): any {
    return this.afAuth.authState
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  // Anonymous User
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false
  }

  // Returns current user display name or Guest
  get currentUserDisplayName(): string {
    if (!this.authState) { return 'Guest' }
    else if (this.currentUserAnonymous) { return 'Anonymous' }
    else { return this.authState['displayName'] || 'User without a Name' }
  }

  //// Social Auth ////

  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider()
    return this.socialSignIn(provider);
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.socialSignIn(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.socialSignIn(provider);
  }

  twitterLogin(){
    const provider = new firebase.auth.TwitterAuthProvider()
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) =>  {
          this.authState = credential.user;
          this.updateUserData();
          this.onLogedIn(credential);
      })
      .catch(error => {
        console.log(error);
        alert("Аккаунт с указанным email уже существует");
      });
  }


  //// Anonymous Auth ////

  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
    .then((user) => {
      this.authState = user
      this.updateUserData()
    })
    .catch(error => console.log(error));
  }

  //// Email/Password Auth ////

  emailSignUp(email: string, password: string, name: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
        this.updateUserData(name);
        this.sendVeify();
        this.onLogedIn(user);
      })
      .then()
      .catch(error => {
        console.log(error);
        alert("Аккаунт с указанным email уже существует");
      });
  }

  emailLogin(email:string, password:string) {
     return this.afAuth.auth.signInWithEmailAndPassword(email, password)
       .then((user) => {
         this.authState = user;
         this.updateUserData();
        // this.saveToken({city: "Гай"}); 
         this.onLogedIn(user);
       })
       .catch(error => {
         console.log(error);
         alert("Email или пароль указаны не верно");
            });
  }

    public onLogedIn( res ){
        console.log('user logged in', res );
        this.router.navigate(['/']);
    }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    var auth = firebase.auth();

    return auth.sendPasswordResetEmail(email)
      .then(() => console.log("email sent"))
      .catch((error) => console.log(error))
  }


  //// Sign Out ////

  signOut(): void {
    this.afAuth.auth.signOut();
    this.router.navigate(['login'])
  }


  //// Helpers ////

  public updateUserData(name: string = this.authState.displayName): void {
  // Writes user name and email to realtime db
  // useful if your app displays information about users or for admin features
    // console.log(this.authState);
    this.authState.updateProfile({
      displayName: name
    });
    let path = `users/${this.currentUserId}`; // Endpoint on firebase
    let data = {
                  email: this.authState.email,
                  name: name
                };


    this.db.object(path).update(data)
    .catch(error => console.log(error));

  }


  public sendVeify(){
        var user = this.afAuth.auth.currentUser;
        
        user.sendEmailVerification()
            .then( this.onVerifySent.bind(this) )
            .catch( console.error );

    } 

  public onVerifySent( res ){
        console.log('verify email sent', res);
    }

  saveToken(user) {
    this.localStorageService.set('USER_INFO', JSON.stringify(user));
  }



}
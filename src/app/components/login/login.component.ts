import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { AppState } from '../../app.service';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

import * as firebase from 'firebase';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public logInForm: FormGroup;
    public signUpForm: FormGroup;
    // public authState: any = null;

  constructor(
        private formBuilder: FormBuilder,
        private appState: AppState,
        private afAuth: AngularFireAuth,
        private db: AngularFireDatabase,
        private router: Router,
        private authService: AuthService
  ) {
        // this.afAuth.authState.subscribe((auth) => {
        // this.authState = auth
        //     });
   }

  public ngOnInit() {
            this.signUpForm = this.formBuilder.group({
            'name':       ['', [ Validators.required ]],
            'email':      ['', [ Validators.required, Validators.email ]],
            'password':   ['', [ Validators.required, Validators.minLength(6)] ],
            'repassword': new FormControl('', [ Validators.required, this.checkRepassword.bind(this)])
        });

        this.logInForm = this.formBuilder.group({
            'email': ['', [Validators.required, Validators.email]],
            'password':  ['', [Validators.required, Validators.minLength(6)]]
        });
  }

      public checkRepassword(){
       let matched = (!this.signUpForm)?false:(this.signUpForm.controls.password.value == this.signUpForm.controls.repassword.value);
       if(matched){
        return null;
       } 

       return Observable.of({ matched: 're-password is not matched.' }); // errors

    }

    onPasswordChange( password ){
        this.signUpForm.controls.repassword.setValue('');
        if(!password){
            this.signUpForm.controls.repassword.disable();
        } else {
            this.signUpForm.controls.repassword.enable();
        }
    }

    public signUp(){ 
       let data = this.signUpForm.getRawValue();
       this.afAuth.auth.createUserWithEmailAndPassword(data.email, data.password)
                       .then( this.initUserData.bind(this, data))
                       .then( this.sendVeify.bind(this, data))
                       .catch(console.error);
       
       console.log('signup request', data);                
    }

    public initUserData( data ){
        let user = this.afAuth.auth.currentUser;
        return user.updateProfile({ displayName: data.name, photoURL: user.photoURL});
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

    public logIn(  ){
        let data = this.logInForm.getRawValue();
        console.log('login request', data);    
        // this.afAuth.auth.signInWithEmailAndPassword(data.email, data.password)
        //                 .then(this.onLogedIn.bind(this))
        //                 .catch( console.error );
        this.authService.emailLogin(data.email, data.password);
    }

    // public onLogedIn( res ){
    //     console.log('user logged in', res );
    //     this.router.navigate(['/']);
    // }

    facebookLogin() {
        // const provider = new firebase.auth.FacebookAuthProvider()
        // return this.socialSignIn(provider);
        this.authService.facebookLogin();
    }

    googleLogin() {
        // const provider = new firebase.auth.GoogleAuthProvider()
        // return this.socialSignIn(provider);
        this.authService.googleLogin();
    }

    // private socialSignIn(provider) {
    //     return this.afAuth.auth.signInWithPopup(provider)
    //   .then((credential) =>  {
    //       this.authState = credential.user;
    //       this.updateUserData();
    //   })
    //   .catch(error => console.log(error));
    // }

    // get authenticated(): boolean {
    //     return this.authState !== null;
    // }

    // // Returns current user UID
    // get currentUserId(): string {
    //     return this.authenticated ? this.authState.uid : '';
    // }

    //   //// Helpers ////

    // private updateUserData(): void {
    // // Writes user name and email to realtime db
    // // useful if your app displays information about users or for admin features

    //     let path = `users/${this.currentUserId}`; // Endpoint on firebase
    //     let data = {
    //                 email: this.authState.email,
    //                 name: this.authState.displayName
    //                 }

    //     this.db.object(path).update(data)
    //     .catch(error => console.log(error));

    // }

}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {
//   removeNgStyles,
//   createNewHosts,
//   createInputTransfer
// } from '@angularclass/hmr';
import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';

import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { AuthGuardGuard } from './services/auth-guard.guard';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './components/login/login.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { environment } from '../environments/environment';

/*
 * Platform and Environment providers/directives/pipes
 */
import { AppState, InternalStateType } from './app.service';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { ROUTES } from './app.routes';

import '../styles/styles.scss';
import '../styles/headings.css';
import { HomeComponent } from './components/home/home.component';
import { LoginErrorComponent } from './shared/modals/login/login.error.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MainComponent } from './components/main/main.component';
import { DataService } from './services/data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import { ImageCropper } from './components/image.cropper/image.cropper.component';
import { ImageCropperComponent } from 'ng2-img-cropper';
import { UploadFormComponent} from './components/upload/upload.component';
import { UploadService } from './services/upload.service';


// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LoginErrorComponent,
    ProfileComponent,
    MainComponent,
    ImageCropper,
    ImageCropperComponent,
    UploadFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    LocalStorageModule.withConfig({prefix: '_', storageType: 'localStorage'}), // localstorage setting
  ],
  providers: [
      APP_PROVIDERS,
      AuthService,
      AuthGuardGuard,
      DataService,
      UploadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

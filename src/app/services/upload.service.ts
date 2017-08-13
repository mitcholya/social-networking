import { Injectable, Inject } from '@angular/core';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Upload, Avatar } from '../shared/model/upload.model';
import { FirebaseApp } from 'angularfire2';
import { AuthService } from './auth.service';

@Injectable()
export class UploadService {

    public firebaseApp: any;
  constructor(
    //  private af: AngularFire,
     private db: AngularFireDatabase,
     @Inject(FirebaseApp) firebaseApp: firebase.app.App,
    private authService: AuthService) {
         console.log(firebaseApp.storage().ref());
         this.firebaseApp = firebaseApp;
      }

  private basePath:string = '/uploads';
  uploads: FirebaseListObservable<Upload[]>;

  pushUpload(upload: Upload) {
    let storageRef = this.firebaseApp.storage().ref();
    let userId = this.authService.currentUserId;
    let uploadTask = storageRef.child(`${this.basePath}/${userId}/${upload.file.name}`).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
        upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      },
      (error) => {
        // upload failed
        console.log(error)
      },
      () => {
        // upload success
        upload.url = uploadTask.snapshot.downloadURL
        upload.name = upload.file.name
        this.saveFileData(upload)
      }
    );
  }

    pushAvatar(upload: Avatar, upload_mini: Avatar) {
    let storageRef = this.firebaseApp.storage().ref();
    let userId = this.authService.currentUserId;
    // let fileName = name + '.jpg';
    let uploadTask = storageRef.child(`${this.basePath}/${userId}/avatar/avatar.jpg`).put(upload.file);
    let uploadTaskMini = storageRef.child(`${this.basePath}/${userId}/avatar/avatar_mini.jpg`).put(upload_mini.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
        upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      },
      (error) => {
        // upload failed
        console.log(error)
      },
      () => {
        // upload success
        // upload.url = uploadTask.snapshot.downloadURL
        // upload.name = upload.file.name
        // this.saveFileData(upload)
      }
    );

    uploadTaskMini.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
        // upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      },
      (error) => {
        // upload failed
        console.log(error)
      },
      () => {
        // upload success
        // upload.url = uploadTask.snapshot.downloadURL
        // upload.name = upload.file.name
        // this.saveFileData(upload)
      }
    );
  } 


  get avatar() {
      let userId = this.authService.currentUserId;
      let storageRef = this.firebaseApp.storage().ref().child('/uploads/'+`${userId}`+'/avatar/avatar.jpg');
     return storageRef.getDownloadURL()
      // .then(url => console.log(url));
  }

  get avatarMini() {
      let userId = this.authService.currentUserId;
      let storageRef = this.firebaseApp.storage().ref().child('/uploads/'+`${userId}`+'/avatar/avatar_mini.jpg');
     return storageRef.getDownloadURL()
      // .then(url => console.log(url));
  }




  // Writes the file details to the realtime db
  private saveFileData(upload: Upload) {
    let userId = this.authService.currentUserId;
    this.db.list(`${this.basePath}/${userId}`).push(upload);
  }
} 


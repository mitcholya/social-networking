import { Injectable } from '@angular/core';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/observable';
import * as firebase from 'firebase/app';
import { UserProfile } from '../shared/model/user.model';

@Injectable()
export class DataService {

    user: FirebaseObjectObservable<any>;
    usersProfileRef: any = firebase.database().ref('user_profile');

    constructor(private afDb: AngularFireDatabase) {

    }

currentCityObservable(userKey: string) {
    return  this.afDb.object(`user_profile/${userKey}`);
  }

addUserProfile(userKey: string, profile: UserProfile) {
        return this.usersProfileRef.child(userKey).set(profile);
}
    
} 
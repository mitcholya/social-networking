import { Component, OnChanges, ChangeDetectorRef, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, FormControl ,Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { IUser, UserProfile } from '../../shared/model/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnChanges, OnInit {



  private name: string = '';
  private gender: string = '';
  private city: string = '';
  private phone: string = '';

  public logInForm: FormGroup;
  public ProfileForm: FormGroup;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private dataService: DataService,
              private localStorageService: LocalStorageService,
              private chDRef: ChangeDetectorRef) {


               }

  ngOnInit() {

                    // this.city =  JSON.stringify(this.localStorageService.get('USER_INFO') );
            console.log(this.city); 
            this.dataService.currentCityObservable(this.authService.currentUserId)
              .subscribe((data) => {
                console.log(data);
                this.city = data.city;
                this.phone = data.phone;
                this.chDRef.detectChanges();
              });

            this.name = this.authService.currentUserDisplayName;
            this.ProfileForm = this.formBuilder.group({
              'name': [this.name, [Validators.required]],
              'city': [this.city, [Validators.required]],
              'phone': [this.phone, [Validators.required]]
            });
                    

  }

  // ngAfterViewInit(): void {
  //   this.cd.detectChanges();
  //   throw new Error("Method not implemented.");
  // }

  ngOnChanges(): void {
    if(!this.city) {
      this.city = '';
      this.phone = '';
    }
  }

  

  public save(){ 
      //  let data = this.ProfileForm.getRawValue();
       
      //  console.log('profile update', data); 
      let userId = this.authService.currentUserId;
      console.log(userId);
      let profile: UserProfile = {
        city: this.city,
        phone: this.phone
        // $key: 'hCk6G5gcjZUFP089ykwzpCEHHhS2',
      }  
      this.dataService.addUserProfile(userId, profile);             
    }

}

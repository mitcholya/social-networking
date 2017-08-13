import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UploadService } from '../../services/upload.service';
import { UserProfile } from '../../shared/model/user.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public userName: string;
  public avatar: string = '';
  public userProfile: any;

  constructor(private authService: AuthService,
              private uploadService: UploadService,
              private dataService: DataService) { }

  ngOnInit() {
     this.userName = this.authService.currentUserDisplayName;
     this.uploadService.avatar
      .then((url) =>  {
        console.log(url);
        this.avatar = url;
      })
      .catch(() => {
        this.avatar = 'https://firebasestorage.googleapis.com/v0/b/social-networking-b41e4.appspot.com/o/Default-avatar.jpg?alt=media&token=eaf2cd34-c034-4c30-908f-e51e8b077a93';
      })

      this.userProfile = this.dataService.currentCityObservable(this.authService.currentUserId);
                            
  }

}

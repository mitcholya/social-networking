import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public userName: string;
  public avatar: string = '';

  constructor(private authService: AuthService,
              private uploadService: UploadService) {
   
   }

  ngOnInit() {
     this.userName = this.authService.currentUserDisplayName;
     this.uploadService.avatarMini
      .then((url) =>  {
        console.log(url);
        this.avatar = url;
      })
      .catch(() => {
        this.avatar = 'https://firebasestorage.googleapis.com/v0/b/social-networking-b41e4.appspot.com/o/Default-avatar.jpg?alt=media&token=eaf2cd34-c034-4c30-908f-e51e8b077a93';
      })
     
  } 

  SignOut() {
    this.authService.signOut();
  }

}

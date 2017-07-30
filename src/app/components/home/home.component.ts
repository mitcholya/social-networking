import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public userName: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userName = this.authService.currentUserDisplayName;
  }

  SignOut() {
    this.authService.signOut();
  }

}

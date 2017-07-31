import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component'
import { DataResolver } from './app.resolver';
import { AuthGuardGuard } from './services/auth-guard.guard';
import { LoginErrorComponent } from './shared/modals/login/login.error.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MainComponent } from './components/main/main.component';
// import { TopicComponent } from "./topic";
// import { PostComponent } from "./post";

export const ROUTES: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuardGuard],
      children: [
          {path: '', component: MainComponent},
          { path: 'profile', component: ProfileComponent},
          { path: 'main', component: MainComponent},
    ] 
    },
  { path: 'login', component: LoginComponent},
  { path: 'login.error', component: LoginErrorComponent},
//   { path: 'topic/:chanel/:topic', component: TopicComponent, canActivate: [AuthGuard] },
//   { path: 'post', component: PostComponent, canActivate: [AuthGuard] },
//   { path: '*', component: HomeComponent}
];
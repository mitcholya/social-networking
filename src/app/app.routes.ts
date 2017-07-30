import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component'
import { DataResolver } from './app.resolver';
import { AuthGuardGuard } from './services/auth-guard.guard';
// import { TopicComponent } from "./topic";
// import { PostComponent } from "./post";

export const ROUTES: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuardGuard] },
  { path: 'login', component: LoginComponent},
//   { path: 'topic/:chanel/:topic', component: TopicComponent, canActivate: [AuthGuard] },
//   { path: 'post', component: PostComponent, canActivate: [AuthGuard] },
//   { path: '*', component: HomeComponent}
];
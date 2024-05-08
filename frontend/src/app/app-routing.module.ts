import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { TrainModelComponent } from './train-model/train-model.component';
import { ExistingModelComponent } from './existing-model/existing-model.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent},
  { path: 'main-page', component: MainPageComponent},
  { path: 'configuration', component: ConfigurationComponent},
  { path: 'profile-page', component: ProfilePageComponent},
  { path: 'train-model', component: TrainModelComponent},
  { path: 'send-data', component: TrainModelComponent},
  { path: 'use-existing-model', component: ExistingModelComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { LoginPageComponent } from 'src/app/login-page/login-page.component';
import { MatButtonModule } from '@angular/material/button';
import { MainPageComponent } from './main-page/main-page.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { HttpClientModule } from '@angular/common/http';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { DeleteObstacleModalComponent } from './delete-obstacle-modal/delete-obstacle-modal.component';
import { SaveRecrdingModalComponent } from './stop-recording-modal/stop-recording-modal.component';
import { TrainModelComponent } from './train-model/train-model.component';
import { DirectionComponent } from './reusable-components/direction/direction.component';
import { StepMessagesComponent } from './reusable-components/step-messages/step-messages.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    MainPageComponent,
    ConfigurationComponent,
    ProfilePageComponent,
    DeleteObstacleModalComponent,
    SaveRecrdingModalComponent,
    TrainModelComponent,
    DirectionComponent,
    StepMessagesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatTableModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule,
    MatDialogModule,
    MatExpansionModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    DirectionComponent,
    StepMessagesComponent
  ]
})
export class AppModule { }

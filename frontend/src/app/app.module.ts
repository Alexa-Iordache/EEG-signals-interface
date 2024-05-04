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
import { DeleteObstacleModalComponent } from './modals/delete-obstacle-modal/delete-obstacle-modal.component';
import { TrainModelComponent } from './train-model/train-model.component';
import { DirectionComponent } from './reusable-components/direction/direction.component';
import { StepMessagesComponent } from './reusable-components/step-messages/step-messages.component';
import { SaveRecordingModalComponent } from './modals/save-recording-modal/save-recording-modal.component';
import { ExistingModelComponent } from './existing-model/existing-model.component';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    MainPageComponent,
    ConfigurationComponent,
    ProfilePageComponent,
    DeleteObstacleModalComponent,
    TrainModelComponent,
    DirectionComponent,
    StepMessagesComponent,
    SaveRecordingModalComponent,
    ExistingModelComponent,
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
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [DirectionComponent, StepMessagesComponent],
})
export class AppModule {}

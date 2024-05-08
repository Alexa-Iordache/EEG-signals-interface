// train-model.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TrainModelService {
  constructor(private http: HttpClient) {}

  sendData(test: any): void {
    // Sending the value to the Node.js server
    this.http.post('http://localhost:4201/send-data', { test }).subscribe(
      (response) => {
        console.log('Response from server:', response);
      },
      (error) => {
        console.error('Error sending data to the server:', error);
      }
    );
  }
}

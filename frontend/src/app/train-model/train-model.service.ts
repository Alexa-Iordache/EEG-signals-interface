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

  getDataFromPython(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http.get<any>('http://localhost:4201/get-data-from-python').subscribe(
        (response) => {
          // console.log(response.data);
          resolve(response); // Return the entire response
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  // getDataFromPython(): Promise<any> {
  //   return this.http.get<any>('http://localhost:4201/get-data-from-python').toPromise();
  // }
}

import { Injectable } from '@angular/core';
import { Recording, Obstacle } from './configuration.component';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  // Recordings from configuration mode
  recording: Recording | null = null;

  // Obstacles from configuration mode
  obstacles: Obstacle[] = [];

  // Method to set recording data
  setRecording(recording: Recording): void {
    this.recording = recording;
  }

  // Method to set obstacles data
  setObstacles(obstacles: Obstacle[]): void {
    this.obstacles = obstacles;
  }

  // Method to get recording data
  getRecording(): Recording | null {
    return this.recording;
  }

  // Method to get obstacles data
  getObstacles(): Obstacle[] {
    return this.obstacles;
  }

  // Method to reset data
  resetData(): void {
    this.recording = null;
    this.obstacles = [];
  }
}

import { Component, HostListener } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  posX = 0;
  posY = 0;
  obstacles: any = [];

  constructor() {}

  ngOnInit(): void {
    this.loadObstacles();
  }

  // the point can be moved on the board using the 4 arrow keys
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // TO DO: moving step to be customizable
    const step = 20;
    switch (event.key) {
      case 'ArrowUp':
        this.posY -= step;
        break;
      case 'ArrowDown':
        this.posY += step;
        break;
      case 'ArrowLeft':
        this.posX -= step;
        break;
      case 'ArrowRight':
        this.posX += step;
        break;
    }
  }

  // !!! TO DO: fix GET/ train-model

  // adds obstacles on the board
  addObstacle(event: MouseEvent) {
    // TO DO: the dimension of the obstacle to be customzible
    const obstacle = {
      x: event.offsetX,
      y: event.offsetY,
      width: 20,
      height: 30,
    };
    this.obstacles.push(obstacle);

    axios
      .post('http://localhost:3000/train-model', obstacle)
      .then((response) => {
        console.log('Obstacle was successfully added. ', response.data);
      })
      .catch((error) => {
        console.error('Error while adding a new obstacle', error);
      });
  }

  // loads the existent obstacles
  loadObstacles() {
    axios
      .get('http://localhost:3000/train-model')
      .then((response) => {
        this.obstacles = response.data;
      })
      .catch((error) => {
        console.error('Error while loading obstacles.', error);
      });
  }
}

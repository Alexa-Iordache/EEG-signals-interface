import { Component, HostListener } from '@angular/core';

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  posX = 0;
  posY = 0;
  obstacles: Obstacle[] = [];

  constructor() {}

  ngOnInit(): void {
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


  // adds obstacles on the board
  addObstacle(event: MouseEvent) {
    // TO DO: the dimension of the obstacle to be customzible
    const obstacle: Obstacle = {
      x: event.offsetX,
      y: event.offsetY,
      width: 20,
      height: 30,
    };
    this.obstacles.push(obstacle);
    console.log(this.obstacles);
  }
}

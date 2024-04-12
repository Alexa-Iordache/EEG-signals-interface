import { Component, HostListener } from '@angular/core';
import { RpcService } from '../services/rpc.service';

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

  obstacleInfo: any;

  constructor(private rpcService: RpcService) {}

  ngOnInit(): void {
    this.getObstacles();
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

  // Method to get all the existing obstacles from database
  getObstacles(): void {
    let params = {
      username: 'admin',
    };

    this.rpcService.callRPC(
      'obstacles.getObstacles',
      params,
      (err: any, res: any) => {
        if (err || res.error) {
          console.log('the obstacles could not be displayed');
          return;
        }
        this.obstacleInfo = res.result;
        console.log(this.obstacleInfo);
      }
    );
  }

  // Method to add a new obstacle (on the board and in database)
  addObstacle(event: MouseEvent) {
    const obstacle: Obstacle = {
      x: event.offsetX,
      y: event.offsetY,
      width: 20,
      height: 30,
    };
    this.obstacles.push(obstacle);
    console.log(this.obstacles);

    let paramsAddObstacle = {
      xPos: obstacle.x,
      yPos: obstacle.y,
      width: obstacle.width,
      height: obstacle.height,
    };

    this.rpcService.callRPC(
      'obstacles.addObstacle',
      paramsAddObstacle,
      (error: any, res: any) => {
        if (error) {
          console.log(error);
          return;
        }
        this.getObstacles();
      }
    );
  }
}

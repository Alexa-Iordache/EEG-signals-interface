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

  widthValue = '20';
  heightValue = '30';

  // Variables for delete confirmation popup
  showDeleteConfirmation = false;
  obstacleToDelete: Obstacle | null = null;

  constructor(private rpcService: RpcService) {}

  ngOnInit(): void {
    this.getObstacles();
  }

  // the point can be moved on the board using the 4 arrow keys
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // TO DO: moving step to be customizable
    const step = 10;

    // Calculate the potential new position of the point
    let newX = this.posX;
    let newY = this.posY;
    switch (event.key) {
      case 'ArrowUp':
        newY -= step;
        break;
      case 'ArrowDown':
        newY += step;
        break;
      case 'ArrowLeft':
        newX -= step;
        break;
      case 'ArrowRight':
        newX += step;
        break;
    }

    // Check if the new position intersects with any obstacle
    const intersects = this.obstacles.some((obstacle) => {
      return (
        newX < obstacle.x + obstacle.width &&
        newX + step > obstacle.x &&
        newY < obstacle.y + obstacle.height &&
        newY + step > obstacle.y
      );
    });

    // If the new position does not intersect with any obstacle, update the position
    if (!intersects) {
      this.posX = newX;
      this.posY = newY;
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

        // Display the existing obstacles from database
        this.obstacles = this.obstacleInfo.map((obstacle: any) => ({
          x: obstacle.xPos,
          y: obstacle.yPos,
          width: obstacle.width,
          height: obstacle.height,
        }));
      }
    );
  }

  // Method to add a new obstacle (on the board and in database)
  addObstacle(event: MouseEvent) {
    const obstacle: Obstacle = {
      x: event.offsetX,
      y: event.offsetY,
      width: parseFloat(this.widthValue),
      height: parseFloat(this.heightValue),
    };
    this.obstacles.push(obstacle);
    console.log(obstacle);

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

  // Method to customize an obstacle before adding it to the board
  applyChanges(width: string, height: string) {
    this.widthValue = width;
    this.heightValue = height;
    console.log(this.widthValue, this.heightValue);
  }

  // Method to handle obstacle click event
  handleObstacleClick(obstacle: Obstacle) {
    this.obstacleToDelete = obstacle;
    this.showDeleteConfirmation = true;
  }

  // Method to cancel obstacle deletion
  cancelDelete() {
    this.obstacleToDelete = null;
    this.showDeleteConfirmation = false;
  }

  // Method to confirm obstacle deletion
  confirmDelete() {
    if (this.obstacleToDelete) {
      // Remove obstacle from obstacles array
      const index = this.obstacles.indexOf(this.obstacleToDelete);
      if (index !== -1) {
        this.obstacles.splice(index, 1);
      }

      // Reset variables
      this.obstacleToDelete = null;
      this.showDeleteConfirmation = false;
    }
  }
}

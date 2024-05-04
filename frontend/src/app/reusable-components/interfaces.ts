// RECORDING object
export interface Recording {
  board_width: number;
  board_height: number;
  robot_step: number;
  robot_start: Position;
  robot_finish: Position;
  configuration_time: number;
  performance: number;
  room_name: string;
  description: string;
}

// OBSTACLE object
export interface Obstacle {
  width: number;
  height: number;
  pos: Position;
}

// ACTION object
export interface Action {
  newPosition: Position;
}

// POSITION object
export interface Position {
  x: number;
  y: number;
}

// object to be displayed in the table
export interface rowData {
  name: string;
  description: string;
}


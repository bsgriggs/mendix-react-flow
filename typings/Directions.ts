export enum EDGE_DIRECTIONS {
    UP = "Up",
    UP_RIGHT = "Up_Right",
    RIGHT = "Right",
    DOWN_RIGHT = "Down_Right",
    DOWN = "Down",
    DOWN_LEFT = "Down_Left",
    LEFT = "Left",
    UP_LEFT = "Up_Left"
}

export function mapDirection(directionStr: string): EDGE_DIRECTIONS {
    return directionStr.toLowerCase() === "up"
        ? EDGE_DIRECTIONS.UP
        : directionStr.toLowerCase() === "up_right"
        ? EDGE_DIRECTIONS.UP_LEFT
        : directionStr.toLowerCase() === "right"
        ? EDGE_DIRECTIONS.RIGHT
        : directionStr.toLowerCase() === "down_right"
        ? EDGE_DIRECTIONS.DOWN_RIGHT
        : directionStr.toLowerCase() === "down"
        ? EDGE_DIRECTIONS.DOWN
        : directionStr.toLowerCase() === "down_left"
        ? EDGE_DIRECTIONS.DOWN_LEFT
        : directionStr.toLowerCase() === "left"
        ? EDGE_DIRECTIONS.LEFT
        : directionStr.toLowerCase() === "up_left"
        ? EDGE_DIRECTIONS.UP_LEFT
        : EDGE_DIRECTIONS.DOWN;
}

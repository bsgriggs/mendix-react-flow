import { Node, Edge, XYPosition } from "@xyflow/react";
import { EDGE_DIRECTIONS } from "../../typings/Directions";

export default function CalcNodePosition(
    node: Node,
    edge: Edge,
    horizontalOffset: number,
    verticalOffset: number,
    invert: boolean = false
): XYPosition {
    let direction = edge.data?.direction || EDGE_DIRECTIONS.DOWN;
    if (invert) {
        // there should be a way to do this mathematically but typescript & enum are rough
        direction =
            direction === EDGE_DIRECTIONS.UP
                ? EDGE_DIRECTIONS.DOWN
                : direction === EDGE_DIRECTIONS.UP_RIGHT
                ? EDGE_DIRECTIONS.DOWN_LEFT
                : direction === EDGE_DIRECTIONS.RIGHT
                ? EDGE_DIRECTIONS.LEFT
                : direction === EDGE_DIRECTIONS.DOWN_RIGHT
                ? EDGE_DIRECTIONS.UP_LEFT
                : direction === EDGE_DIRECTIONS.DOWN
                ? EDGE_DIRECTIONS.UP
                : direction === EDGE_DIRECTIONS.DOWN_LEFT
                ? EDGE_DIRECTIONS.UP_RIGHT
                : direction === EDGE_DIRECTIONS.LEFT
                ? EDGE_DIRECTIONS.RIGHT
                : direction === EDGE_DIRECTIONS.UP_LEFT
                ? EDGE_DIRECTIONS.DOWN_RIGHT
                : EDGE_DIRECTIONS.UP;
    }
    // console.info("calc node pos", { direction, node, edge, horizontalOffset, verticalOffset });
    return {
        x:
            direction === EDGE_DIRECTIONS.LEFT ||
            direction === EDGE_DIRECTIONS.UP_LEFT ||
            direction === EDGE_DIRECTIONS.DOWN_LEFT
                ? node.position.x - horizontalOffset
                : direction === EDGE_DIRECTIONS.RIGHT ||
                  direction === EDGE_DIRECTIONS.UP_RIGHT ||
                  direction === EDGE_DIRECTIONS.DOWN_RIGHT
                ? node.position.x + horizontalOffset
                : node.position.x,
        y:
            direction === EDGE_DIRECTIONS.UP ||
            direction === EDGE_DIRECTIONS.UP_LEFT ||
            direction === EDGE_DIRECTIONS.UP_RIGHT
                ? node.position.y - verticalOffset
                : direction === EDGE_DIRECTIONS.DOWN ||
                  direction === EDGE_DIRECTIONS.DOWN_LEFT ||
                  direction === EDGE_DIRECTIONS.DOWN_RIGHT
                ? node.position.y + verticalOffset
                : node.position.y
    };
}

import { Handle, Position, useEdges, useNodes, Node, XYPosition } from "@xyflow/react";
import classNames from "classnames";
import { ReactElement, createElement, memo, useMemo, MouseEvent } from "react";
import MxIcon from "./mxIcon";

export interface CustomNodeProps {
    id: string;
    data: any;
    deletable: boolean;
    draggable: boolean;
    isConnectable: boolean;
    selected: boolean;
    positionAbsoluteX: number;
    positionAbsoluteY: number;
}

const determineNodeDirectionIcon = (fromPos: XYPosition, toPos: XYPosition): string =>
    fromPos.x > toPos.x
        ? "mx-icon-chevron-left"
        : fromPos.x < toPos.x
        ? "mx-icon-chevron-right"
        : fromPos.y > toPos.y
        ? "mx-icon-chevron-up"
        : fromPos.y < toPos.y
        ? "mx-icon-chevron-down"
        : "mx-icon-question-circle";

export default memo((props: CustomNodeProps): ReactElement => {
    const edges = useEdges();
    const nodes = useNodes();

    const nodesTargetingThis: Node[] = useMemo(() => {
        const newNodes: Node[] = [];
        edges
            .filter(edge => edge.target === props.id)
            .forEach(edge => {
                const sourceNode = nodes.find(node => node.id === edge.source);
                if (sourceNode) {
                    newNodes.push(sourceNode);
                }
            });

        return newNodes;
    }, [edges, nodes, props.id]);
    const nodesSourcingThis: Node[] = useMemo(() => {
        const newNodes: Node[] = [];
        edges
            .filter(edge => edge.source === props.id)
            .forEach(edge => {
                const targetNode = nodes.find(node => node.id === edge.target);
                if (targetNode) {
                    newNodes.push(targetNode);
                }
            });

        return newNodes;
    }, [edges, nodes, props.id]);

    const handleClickNav = (event: MouseEvent<HTMLButtonElement>, nodeId: string): void => {
        event.stopPropagation(); // prevent clicking the button from selecting THIS node
        (window as any).reactFlowFocus(nodeId);
    };

    return (
        <div className={classNames("custom-node", { selected: props.selected }, { nodrag: !props.draggable })}>
            {nodesTargetingThis.length > 0 && (
                <Handle id="top" type="target" position={Position.Top} isConnectable={false} />
            )}

            {props.selected && (
                <div className="target-btns">
                    {nodesTargetingThis.map(node => (
                        <button
                            key={node.id}
                            className="btn mx-button"
                            title={`Navigate to ${props.data.label}`}
                            onClick={event => handleClickNav(event, node.id)}
                        >
                            <MxIcon
                                className={`mx-icon-lined ${determineNodeDirectionIcon(
                                    { x: props.positionAbsoluteX, y: props.positionAbsoluteY },
                                    node.position
                                )}`}
                                isGlyph={false}
                            />
                        </button>
                    ))}
                </div>
            )}

            <div className="node-content">{props.data.children}</div>
            {props.selected && (
                <div className="source-btns">
                    {nodesSourcingThis.map(node => (
                        <button
                            key={node.id}
                            className="btn mx-button"
                            title={`Navigate to ${props.data.label}`}
                            onClick={event => handleClickNav(event, node.id)}
                        >
                            <MxIcon
                                className={`mx-icon-lined ${determineNodeDirectionIcon(
                                    { x: props.positionAbsoluteX, y: props.positionAbsoluteY },
                                    node.position
                                )}`}
                                isGlyph={false}
                            />
                        </button>
                    ))}
                </div>
            )}
            {nodesSourcingThis.length > 0 && (
                <Handle id="bottom" type="source" position={Position.Bottom} isConnectable={false} />
            )}
        </div>
    );
});

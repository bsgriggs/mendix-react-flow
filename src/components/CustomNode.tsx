import { Handle, Position, useEdges, useNodes, Node, XYPosition, useUpdateNodeInternals } from "@xyflow/react";
import classNames from "classnames";
import { ReactElement, createElement, memo, useMemo, MouseEvent, useState } from "react";
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

interface IHandleCounts {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

const defaultHandleCounts: IHandleCounts = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
};

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
    const [sourceCounts, setSourceCounts] = useState<IHandleCounts>(defaultHandleCounts);
    const [targetCounts, setTargetCounts] = useState<IHandleCounts>(defaultHandleCounts);
    const edges = useEdges();
    const nodes = useNodes();
    const updateNodeInternals = useUpdateNodeInternals();

    const nodesTargetingThis: Node[] = useMemo(() => {
        const newNodes: Node[] = [];
        let newTargetCount: IHandleCounts = structuredClone(defaultHandleCounts);
        edges
            .filter(edge => edge.target === props.id)
            .forEach(edge => {
                const sourceNode = nodes.find(node => node.id === edge.source);
                if (sourceNode) {
                    newNodes.push(sourceNode);
                    newTargetCount = {
                        top: edge.targetHandle === "target-Top" ? newTargetCount.top + 1 : newTargetCount.top,
                        right: edge.targetHandle === "target-Right" ? newTargetCount.right + 1 : newTargetCount.right,
                        bottom:
                            edge.targetHandle === "target-Bottom" ? newTargetCount.bottom + 1 : newTargetCount.bottom,
                        left: edge.targetHandle === "target-Left" ? newTargetCount.left + 1 : newTargetCount.left
                    };
                }
            });
        setTargetCounts(newTargetCount);
        updateNodeInternals(props.id);
        return newNodes;
    }, [edges, nodes, props.id, setTargetCounts, defaultHandleCounts]);
    const nodesSourcingThis: Node[] = useMemo(() => {
        const newNodes: Node[] = [];
        let newSourceCounts: IHandleCounts = structuredClone(defaultHandleCounts);
        edges
            .filter(edge => edge.source === props.id)
            .forEach(edge => {
                const targetNode = nodes.find(node => node.id === edge.target);
                if (targetNode) {
                    newNodes.push(targetNode);
                    newSourceCounts = {
                        top: edge.sourceHandle === "source-Top" ? newSourceCounts.top + 1 : newSourceCounts.top,
                        right: edge.sourceHandle === "source-Right" ? newSourceCounts.right + 1 : newSourceCounts.right,
                        bottom:
                            edge.sourceHandle === "source-Bottom" ? newSourceCounts.bottom + 1 : newSourceCounts.bottom,
                        left: edge.sourceHandle === "source-Left" ? newSourceCounts.left + 1 : newSourceCounts.left
                    };
                }
            });
        setSourceCounts(newSourceCounts);
        updateNodeInternals(props.id);
        return newNodes;
    }, [edges, nodes, props.id, setSourceCounts, defaultHandleCounts, updateNodeInternals]);

    const handleClickNav = (event: MouseEvent<HTMLButtonElement>, nodeId: string): void => {
        event.stopPropagation(); // prevent clicking the button from selecting THIS node
        (window as any).reactFlowFocus(nodeId);
    };

    return (
        <div className={classNames("custom-node", { selected: props.selected }, { nodrag: !props.draggable })}>
            {targetCounts.top > 0 && (
                <Handle id="target-Top" type="target" position={Position.Top} isConnectable={false} />
            )}
            {targetCounts.right > 0 && (
                <Handle id="target-Right" type="target" position={Position.Right} isConnectable={false} />
            )}
            {targetCounts.bottom > 0 && (
                <Handle id="target-Bottom" type="target" position={Position.Bottom} isConnectable={false} />
            )}
            {targetCounts.left > 0 && (
                <Handle id="target-Left" type="target" position={Position.Left} isConnectable={false} />
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
            {sourceCounts.top > 0 && (
                <Handle id="source-Top" type="source" position={Position.Top} isConnectable={false} />
            )}
            {sourceCounts.right > 0 && (
                <Handle id="source-Right" type="source" position={Position.Right} isConnectable={false} />
            )}
            {sourceCounts.bottom > 0 && (
                <Handle id="source-Bottom" type="source" position={Position.Bottom} isConnectable={false} />
            )}
            {sourceCounts.left > 0 && (
                <Handle id="source-Left" type="source" position={Position.Left} isConnectable={false} />
            )}
        </div>
    );
});

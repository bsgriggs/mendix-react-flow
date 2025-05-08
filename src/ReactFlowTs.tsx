import { ReactElement, createElement, useCallback, useState, useEffect } from "react";
import FlowProvider from "./components/FlowProvider";
import { Edge, Node, MarkerType } from "@xyflow/react";
import { ValueStatus, ObjectItem } from "mendix";
import { ReactFlowTsContainerProps } from "../typings/ReactFlowTsProps";

import "./ui/ReactFlowTs.css";
import classNames from "classnames";

export function ReactFlowTs(props: ReactFlowTsContainerProps): ReactElement {
    const [edges, setEdges] = useState<Edge[]>([]);
    const [nodes, setNodes] = useState<Node[]>([]);

    useEffect(() => {
        if (props.edges.status === ValueStatus.Available && props.edges.items) {
            setEdges(
                props.edges.items.map(
                    edgeObj =>
                        ({
                            id: props.edgeId.get(edgeObj).value,
                            source: props.nodeSourceId.get(edgeObj).value,
                            target: props.nodeTargetId.get(edgeObj).value,
                            selectable: false,
                            animated: props.lineType.get(edgeObj).value === "Dotted",
                            markerEnd: {
                                type: MarkerType.Arrow
                            },
                            data: {
                                objItem: edgeObj
                            },
                            className: props.edgeClassName?.get(edgeObj).value
                        } as Edge)
                )
            );
        } else {
            setEdges([]);
        }
    }, [props.edges, props.edgeId, props.nodeSourceId, props.nodeTargetId, props.lineType, props.edgeClassName]);

    const mapNode = useCallback(
        (nodeObj: ObjectItem): Node =>
            ({
                id: props.nodeId.get(nodeObj).value,
                type: "customNode",
                position: {
                    x: Number(props.nodePosX.get(nodeObj).value) || 0,
                    y: Number(props.nodePosY.get(nodeObj).value) || 0
                },
                selected: props.selectedNode.selection === nodeObj,
                deletable: false,
                draggable: true,
                className: props.nodeClassName?.get(nodeObj).value,
                data: {
                    objItem: nodeObj,
                    children: props.nodeContent.get(nodeObj)
                }
            } as Node),
        [props.selectedNode, props.nodeId, props.nodeClassName, props.nodeContent, props.nodePosX, props.nodePosY]
    );

    useEffect(() => {
        const newNodes: Node[] = [];
        if (props.nodes.status === ValueStatus.Available && props.nodes.items) {
            newNodes.push(...props.nodes.items.map(mapNode));
        }
        setNodes(newNodes);
    }, [edges, props.nodes, mapNode]);

    const handleNodeClick = (clickedNode: Node): void => {
        const clickObj = clickedNode.data?.objItem;
        props.selectedNode.setSelection(clickObj as ObjectItem);
        if (props.onClickNode && clickObj) {
            props.onClickNode.get(clickObj as ObjectItem).execute();
        }
    };

    const handleEdgeClick = (clickedEdge: Edge): void => {
        const clickObj = clickedEdge.data?.objItem;
        if (props.onClickEdge && clickObj) {
            props.onClickEdge.get(clickObj as ObjectItem).execute();
        }
    };

    if (
        props.nodes.status === ValueStatus.Loading ||
        props.edges.status === ValueStatus.Loading ||
        props.defaultZoom.status === ValueStatus.Loading ||
        props.navZoom.status === ValueStatus.Loading
    ) {
        return (
            <div
                id={props.name}
                className={classNames("mendix-react-flow", props.class)}
                // Library requires parent to have a set width & height
                style={{ width: props.containerWidth.value, height: props.containerWidth.value, ...props.style }}
            >
                {props.loadingContent}
            </div>
        );
    }

    return (
        <FlowProvider
            // System
            name={props.name}
            class={props.class}
            style={props.style}
            tabIndex={props.tabIndex}
            // Nodes
            nodes={nodes}
            nodeFocusOverride={props.nodeFocusOverride?.value}
            // Edges
            edges={edges}
            // Styling
            containerWidth={props.containerWidth.value as string}
            containerHeight={props.containerHeight.value as string}
            defaultViewType={props.defaultViewType}
            defaultZoom={Number(props.defaultZoom.value)}
            navZoom={Number(props.navZoom.value)}
            // Actions
            onClickNode={handleNodeClick}
            onClickEdge={handleEdgeClick}
        />
    );
}

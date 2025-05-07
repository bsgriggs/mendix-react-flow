import { ReactElement, createElement, useCallback, useState, useEffect } from "react";
import FlowProvider from "./components/FlowProvider";
import { Edge, Node, MarkerType } from "@xyflow/react";
import { ValueStatus, ObjectItem } from "mendix";
import { ReactFlowTsContainerProps } from "../typings/ReactFlowTsProps";

import "./ui/ReactFlowTs.css";
import classNames from "classnames";
import CalcNodePosition from "./utils/CalcNodePosition";
import { mapDirection } from "typings/Directions";

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
                                objItem: edgeObj,
                                direction: mapDirection(props.edgeDirection.get(edgeObj).value as string)
                            }
                        } as Edge)
                )
            );
        } else {
            setEdges([]);
        }
    }, [props.edges, props.edgeId, props.nodeSourceId, props.nodeTargetId, props.lineType]);

    const mapNode = useCallback(
        (nodeObj: ObjectItem, index: number): Node =>
            ({
                id: props.nodeId.get(nodeObj).value,
                type: "customNode",
                position: { x: 0, y: 0 },
                selected: props.selectedNode.selection === nodeObj,
                deletable: false,
                draggable: true,
                className: props.nodeClassName?.get(nodeObj).value,
                data: {
                    objItem: nodeObj,
                    children: props.nodeContent.get(nodeObj),
                    hOffset: Number(props.horizontalOffset.get(nodeObj).value),
                    vOffset: Number(props.verticalOffset.get(nodeObj).value),
                    sort: props.nodeSort ? props.nodeSort.get(nodeObj).value : index
                }
            } as Node),
        [
            props.selectedNode,
            props.nodeId,
            props.nodeClassName,
            props.nodeContent,
            props.nodeSort,
            props.horizontalOffset,
            props.verticalOffset
        ]
    );

    useEffect(() => {
        const newNodes: Node[] = [];
        if (props.nodes.status === ValueStatus.Available && props.nodes.items) {
            newNodes.push(
                ...props.nodes.items.map(mapNode).sort((a, b) => (a.data.sort as number) - (b.data.sort as number))
            );
            const remainingEdges: Edge[] = Array.from(edges);
            function moveNextNodes(node: Node, recurse: boolean, animated: boolean | undefined): void {
                // recursive function to nav through forward nodes
                const sourceEdges = edges.filter(
                    edge => edge.source === node.id && (animated === undefined || edge.animated === animated)
                ); // Edges where this node is the source
                sourceEdges.forEach(edge => {
                    const targetNode = newNodes.find(targetNode => targetNode.id === edge.target);
                    if (targetNode) {
                        targetNode.position = CalcNodePosition(
                            node,
                            edge,
                            Number(targetNode.data.hOffset),
                            Number(targetNode.data.vOffset)
                        );
                        const edgeIndex = remainingEdges.findIndex(fEdge => fEdge.id === edge.id);
                        if (edgeIndex > -1) {
                            remainingEdges.splice(edgeIndex, 1);
                        }
                        if (recurse) {
                            moveNextNodes(targetNode, recurse, animated);
                        }
                    }
                });
            }

            function movePrevNodes(node: Node, recurse: boolean, animated: boolean | undefined): void {
                // recursive function to nav through previous nodes
                const targetEdges = edges.filter(
                    edge => edge.target === node.id && (animated === undefined || edge.animated === animated)
                ); // Edges where this node is the target
                targetEdges.forEach(edge => {
                    const sourceNode = newNodes.find(targetNode => targetNode.id === edge.source);
                    if (sourceNode) {
                        sourceNode.position = CalcNodePosition(
                            node,
                            edge,
                            Number(sourceNode.data.hOffset),
                            Number(sourceNode.data.vOffset),
                            true
                        );
                        console.info("node adjusted by target", {
                            node,
                            edge,
                            sourceNode,
                            newPos: sourceNode.position
                        });
                        if (recurse) {
                            movePrevNodes(sourceNode, recurse, animated);
                        }
                    } else {
                        console.info("no prev node found", { node, edge });
                    }
                });
            }
            //Post processing
            newNodes.forEach(node => {
                moveNextNodes(node, false, false);
            });
            console.info("remainingEdges", remainingEdges);
            remainingEdges.forEach(edge => {
                const prevNodes = newNodes.filter(iNode => iNode.id === edge.source);
                if (prevNodes) {
                    prevNodes.forEach(prevNode => {
                        movePrevNodes(prevNode, false, true);
                        moveNextNodes(prevNode, false, true);
                        movePrevNodes(prevNode, true, false);
                        moveNextNodes(prevNode, true, false);
                    });
                }
            });
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
                style={{ width: "50vw", height: "75vh", ...props.style }}
            >
                Loading
            </div>
        );
    }

    // console.info("edges state", edges);
    // console.info("nodes state", nodes);

    return (
        <FlowProvider
            // System
            name={props.name}
            class={props.class}
            style={props.style}
            tabIndex={props.tabIndex}
            // Nodes
            nodes={nodes}
            // Edges
            edges={edges}
            // Styling
            defaultViewType={props.defaultViewType}
            defaultZoom={Number(props.defaultZoom.value)}
            navZoom={Number(props.navZoom.value)}
            // Actions
            onClickNode={handleNodeClick}
            onClickEdge={handleEdgeClick}
        />
    );
}

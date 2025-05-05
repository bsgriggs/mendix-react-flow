import { ReactElement, createElement, useMemo } from "react";
import ReactFlowComp from "./components/ReactFlowComp";
import { Edge, Node, MarkerType } from "@xyflow/react";
import { ValueStatus, ObjectItem } from "mendix";
import { ReactFlowTsContainerProps } from "../typings/ReactFlowTsProps";

import "./ui/ReactFlowTs.css";

export function ReactFlowTs(props: ReactFlowTsContainerProps): ReactElement {
    const nodes: Node[] = useMemo(() => {
        if (props.nodes.status === ValueStatus.Available && props.nodes.items) {
            return props.nodes.items.map(
                (nodeObj, index) =>
                    ({
                        id: props.nodeId.get(nodeObj).value,
                        position: { x: 0, y: index * 100 },
                        selected: props.selectedNode.selection === nodeObj,
                        deletable: false,
                        draggable: false,
                        data: {
                            label: props.nodeLabel.get(nodeObj).value,
                            objItem: nodeObj
                        }
                    } as Node)
            );
        } else {
            return [];
        }
    }, [props.nodes, props.selectedNode, props.nodeId, props.nodeLabel]);

    const edges: Edge[] = useMemo(() => {
        if (props.edges.status === ValueStatus.Available && props.edges.items) {
            return props.edges.items.map(
                edgeObj =>
                    ({
                        id: props.edgeId.get(edgeObj).value,
                        source: props.nodeSourceId.get(edgeObj).value,
                        target: props.nodeTargetId.get(edgeObj).value,
                        selectable: false,
                        markerEnd: {
                            type: MarkerType.Arrow,
                            strokeWidth: 5
                        },
                        data: {
                            objItem: edgeObj
                        }
                    } as Edge)
            );
        } else {
            return [];
        }
    }, [props.edges, props.edgeId, props.nodeSourceId, props.nodeTargetId]);

    const handleNodeClick = (clickedNode: Node) => {
        const clickObj = clickedNode.data?.objItem;
        console.info("clicked", clickedNode);
        props.selectedNode.setSelection(clickObj as ObjectItem);
        if (props.onClickNode && clickObj) {
            props.onClickNode.get(clickObj as ObjectItem).execute();
        }
    };

    const handleEdgeClick = (clickedEdge: Edge) => {
        const clickObj = clickedEdge.data?.objItem;
        if (props.onClickEdge && clickObj) {
            props.onClickEdge.get(clickObj as ObjectItem).execute();
        }
    };

    console.info("props", props, nodes, edges);

    return (
        <ReactFlowComp
            // System
            name={props.name}
            class={props.class}
            style={props.style}
            tabIndex={props.tabIndex}
            // Nodes
            nodes={nodes}
            // Edges
            edges={edges}
            // Actions
            onClickNode={handleNodeClick}
            onClickEdge={handleEdgeClick}
        />
    );
}

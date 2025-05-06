import { ReactElement, createElement, useMemo, useCallback } from "react";
import FlowProvider from "./components/FlowProvider";
import { Edge, Node, MarkerType } from "@xyflow/react";
import { ValueStatus, ObjectItem } from "mendix";
import { ReactFlowTsContainerProps } from "../typings/ReactFlowTsProps";

import "./ui/ReactFlowTs.css";
import INodeSort from "typings/INodeSort";
import classNames from "classnames";

export function ReactFlowTs(props: ReactFlowTsContainerProps): ReactElement {
    const mapNodes = useCallback(
        (nodeObj: ObjectItem, index: number): Node =>
            ({
                id: props.nodeId.get(nodeObj).value,
                type: "customNode",
                position: { x: 0, y: index * Number(props.verticalOffset.get(nodeObj).value) },
                selected: props.selectedNode.selection === nodeObj,
                deletable: false,
                draggable: false,
                className: props.nodeClassName?.get(nodeObj).value,
                data: {
                    objItem: nodeObj,
                    children: props.nodeContent.get(nodeObj)
                }
            } as Node),
        [props.selectedNode, props.nodeId, props.nodeClassName, props.nodeContent, props.verticalOffset]
    );

    const nodes: Node[] = useMemo(() => {
        if (props.nodes.status === ValueStatus.Available && props.nodes.items) {
            if (props.nodeSort !== undefined) {
                const sortedList: INodeSort[] = props.nodes.items.map(obj => ({
                    obj,
                    sort: Number(props.nodeSort?.get(obj).value)
                }));
                return sortedList.sort().map((iNodeSort, index) => mapNodes(iNodeSort.obj, index));
            }
            return props.nodes.items.map(mapNodes);
        } else {
            return [];
        }
    }, [props.nodes, props.nodeSort, mapNodes]);

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
                            type: MarkerType.Arrow
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

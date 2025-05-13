import { ReactElement, createElement, useCallback, useMemo, useState } from "react";
import FlowProvider from "./components/FlowProvider";
import { Edge, Node, MarkerType } from "@xyflow/react";
import { ValueStatus, ObjectItem } from "mendix";
import { ReactFlowTsContainerProps } from "../typings/ReactFlowTsProps";

import "./ui/ReactFlowTs.css";
import classNames from "classnames";

export function ReactFlowTs(props: ReactFlowTsContainerProps): ReactElement {
    const [lockDragging, setLockDragging] = useState<boolean>(false);

    const edges = useMemo(
        () =>
            props.edges.status === ValueStatus.Available && props.edges.items
                ? props.edges.items.map((edgeObj, index) => {
                      const sourceID = props.nodeSourceId.get(edgeObj).value;
                      const targetID = props.nodeTargetId.get(edgeObj).value;
                      const arrowType = props.arrowType.get(edgeObj).value;
                      const curveType = props.curveType.get(edgeObj).value;

                      return {
                          id: `#${index}: ${sourceID}->${targetID}`,
                          type: curveType === "bezier" ? "default" : curveType,
                          source: sourceID,
                          sourceHandle: `source-${props.sourceLineSide.get(edgeObj).value}`,
                          target: targetID,
                          targetHandle: `target-${props.targetLineSide.get(edgeObj).value}`,
                          selectable: false,
                          animated: props.lineType.get(edgeObj).value === "Dotted",

                          markerEnd: {
                              type: arrowType === "Solid" ? MarkerType.ArrowClosed : MarkerType.Arrow,
                              strokeWidth: 2
                          },
                          data: {
                              objItem: edgeObj
                          },
                          label: props.edgeLabel?.get(edgeObj).value,
                          ariaLabel: props.edgeAriaLabel?.get(edgeObj).value,
                          className: props.edgeClassName?.get(edgeObj).value
                      } as Edge;
                  })
                : [],
        [
            props.edges,
            props.nodeSourceId,
            props.nodeTargetId,
            props.lineType,
            props.edgeClassName,
            props.edgeLabel,
            props.targetLineSide,
            props.sourceLineSide,
            props.arrowType,
            props.curveType,
            props.edgeAriaLabel
        ]
    );

    const nodes = useMemo(
        () =>
            props.nodes.status === ValueStatus.Available && props.nodes.items
                ? props.nodes.items.map(nodeObj => {
                      const width = props.nodeWidth ? props.nodeWidth.get(nodeObj).value : undefined;
                      const height = props.nodeHeight ? props.nodeHeight.get(nodeObj).value : undefined;

                      return {
                          id: props.nodeId.get(nodeObj).value,
                          type: "customNode",
                          position: {
                              x: Number(props.nodePosX.get(nodeObj).value) || 0,
                              y: Number(props.nodePosY.get(nodeObj).value) || 0
                          },
                          width: width ? Number(width) : undefined,
                          height: height ? Number(height) : undefined,
                          selected: props.selectedNode.selection === nodeObj,
                          deletable: false,
                          draggable: lockDragging ? false : props.allowDragging.get(nodeObj).value === true,
                          className: props.nodeClassName?.get(nodeObj).value,
                          data: {
                              label: props.nodeLabel.get(nodeObj).value,
                              objItem: nodeObj,
                              children: props.nodeContent.get(nodeObj),
                              toolbarType: props.toolbarType,
                              toolbarGap: props.toolbarType !== "OFF" ? props.toolbarGap.get(nodeObj).value : undefined,
                              toolbarPosition:
                                  props.toolbarType !== "OFF" ? props.toolbarPosition.get(nodeObj).value : undefined,
                              toolbarAlignment:
                                  props.toolbarType !== "OFF" ? props.toolbarAlignment.get(nodeObj).value : undefined,
                              toolbarContent:
                                  props.toolbarType !== "OFF" ? props.toolbarContent.get(nodeObj) : undefined
                          },
                          ariaLabel: props.nodeAriaLabel?.get(nodeObj).value
                      } as Node;
                  })
                : [],
        [
            props.nodes,
            props.selectedNode,
            props.nodeId,
            props.nodeClassName,
            props.nodeContent,
            props.nodePosX,
            props.nodePosY,
            props.nodeLabel,
            props.allowDragging,
            props.nodeWidth,
            props.nodeHeight,
            props.nodeAriaLabel,
            props.toolbarType,
            props.toolbarGap,
            props.toolbarPosition,
            props.toolbarAlignment,
            props.toolbarContent
        ]
    );

    const handleNodeClick = useCallback(
        (clickedNode: Node): void => {
            const clickObj = clickedNode.data?.objItem;
            props.selectedNode.setSelection(clickObj as ObjectItem);
            if (props.onClickNode && clickObj) {
                props.onClickNode.get(clickObj as ObjectItem).execute();
            }
        },
        [props.onClickNode, props.selectedNode]
    );

    const handleEdgeClick = useCallback(
        (clickedEdge: Edge): void => {
            const clickObj = clickedEdge.data?.objItem;
            if (props.onClickEdge && clickObj) {
                props.onClickEdge.get(clickObj as ObjectItem).execute();
            }
        },
        [props.onClickEdge]
    );

    const handleNodeDrag = useCallback(
        (draggedNode: Node): void => {
            const clickObj = draggedNode.data?.objItem;
            if (props.onDragNode && clickObj) {
                props.onDragNode.get(clickObj as ObjectItem).execute();
            }
        },
        [props.onClickNode, props.selectedNode]
    );

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
            setLockDragging={setLockDragging}
            // Nodes
            nodes={nodes}
            focusedNodeOverride={props.focusedNodeOverride?.value}
            // Edges
            edges={edges}
            // Styling
            containerWidth={props.containerWidth.value as string}
            containerHeight={props.containerHeight.value as string}
            defaultViewType={props.defaultViewType}
            defaultZoom={Number(props.defaultZoom.value)}
            navZoom={Number(props.navZoom.value)}
            snapToGrid={props.snapToGrid !== "OFF"}
            snapGrid={
                props.snapToGrid === "OFF"
                    ? [50, 50]
                    : props.snapToGrid === "BACKGROUND"
                    ? [Number(props.backgroundGap.value || 50), Number(props.backgroundGap.value || 50)]
                    : [Number(props.snapGridX.value), Number(props.snapGridY.value)]
            }
            //Background
            backgroundGap={Number(props.backgroundGap.value || 50)}
            backgroundType={props.backgroundType}
            backgroundSize={
                props.backgroundType === "CROSSES"
                    ? Number(props.crossSize.value)
                    : props.backgroundType === "DOTS"
                    ? Number(props.dotSize.value)
                    : Number(props.lineWidth.value)
            }
            // Actions
            onClickNode={handleNodeClick}
            onDragNode={handleNodeDrag}
            onClickEdge={handleEdgeClick}
        />
    );
}

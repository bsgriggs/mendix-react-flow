import { ReactElement, createElement, useMemo, useEffect, useCallback, useState } from "react";
import {
    Controls,
    MiniMap,
    ReactFlow,
    Edge,
    Node,
    Viewport,
    useReactFlow,
    Background,
    useEdgesState,
    useNodesState,
    useStoreApi,
    BackgroundVariant
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomNode";
import { BackgroundTypeEnum, DefaultViewTypeEnum } from "../../typings/ReactFlowTsProps";
import Clamp from "../utils/Clamp";

const nodeTypes = {
    customNode: CustomNode
};

export interface FlowProps {
    // System
    tabIndex?: number;
    setLockDragging: (newDraggable: boolean) => void;

    // Nodes
    nodes: Node[];
    focusedNodeOverride: string | undefined;

    // Edges
    edges: Edge[];

    // Styling
    defaultViewType: DefaultViewTypeEnum;
    defaultZoom: number;
    navZoom: number;
    snapToGrid: boolean;
    snapGrid: [number, number];

    //Background
    backgroundType: BackgroundTypeEnum;
    backgroundGap: number;
    backgroundSize: number;

    // Actions
    onClickNode: (clickedNode: Node) => void;
    onDragNode: (draggedNode: Node) => void;
    onClickEdge: (clickedEdge: Edge) => void;
}

const Flow = (props: FlowProps): ReactElement => {
    // use states for nodes and edges, so dragging is saved
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    useEffect(() => setNodes(props.nodes), [props.nodes, setNodes]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    useEffect(() => setEdges(props.edges), [props.edges, setEdges]);
    const [retryAttempts, setRetryAttempts] = useState<number>(0);
    const [focusOverride, setFocusOverride] = useState<string>("");

    const store = useStoreApi();
    const { resetSelectedElements, addSelectedNodes } = store.getState();

    const defaultViewport: Viewport = useMemo(
        () => ({ x: 400, y: 0, zoom: Clamp(props.defaultZoom, 0.5, 2) }),
        [props.defaultZoom]
    );
    const { fitView } = useReactFlow();

    const focusNode = useCallback(
        (nodeId: string): boolean => {
            const focusedNode = props.nodes.find(node => node.id === nodeId);
            if (focusedNode) {
                resetSelectedElements();
                addSelectedNodes([focusedNode.id]);
                props.onClickNode(focusedNode);
                fitView({
                    nodes: [{ id: focusedNode.id }],
                    duration: 500,
                    maxZoom: Clamp(props.navZoom, 0.5, 2),
                    minZoom: Clamp(props.navZoom, 0.5, 2)
                });
                setTimeout(() => {
                    // after the library focuses the node, focus the first available nav button
                    (document.querySelector(".custom-node.selected .btn") as any).focus();
                }, 650);

                return true;
            }
            return false;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [fitView, props.nodes, Clamp, resetSelectedElements, addSelectedNodes, props.navZoom]
    ); // props.onClickNode cannot be in dependency arrays, infinite loop

    useEffect(() => {
        setRetryAttempts(0);
    }, [props.focusedNodeOverride, setRetryAttempts]);

    useEffect(() => {
        if (props.focusedNodeOverride !== focusOverride && retryAttempts < 20) {
            setTimeout(() => {
                if (props.focusedNodeOverride) {
                    const success = focusNode(props.focusedNodeOverride);
                    if (!success) {
                        setRetryAttempts(retryAttempts + 1); // keep retrying until success
                    } else {
                        setRetryAttempts(0);
                        setFocusOverride(props.focusedNodeOverride);
                    }
                }
            }, 100);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.focusedNodeOverride, retryAttempts, setRetryAttempts, focusOverride, setFocusOverride]);
    // focusNode cannot be in dependency arrays, infinite loop

    useEffect(() => {
        // Mount a special browser function, so the custom node can call this function without having to iterate all the nodes to set this function.
        (window as any).reactFlowFocus = focusNode;
        return () => {
            // On unmount, remove the special function
            (window as any).reactFlowFocus = undefined;
        };
    }, [focusNode]);

    const backgroundVariant = useMemo(
        (): BackgroundVariant =>
            props.backgroundType === "DOTS"
                ? BackgroundVariant.Dots
                : props.backgroundType === "CROSSES"
                ? BackgroundVariant.Cross
                : props.backgroundType === "LINES"
                ? BackgroundVariant.Lines
                : BackgroundVariant.Dots,
        [props.backgroundType]
    );

    return (
        <ReactFlow
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView={props.defaultViewType === "FULL"}
            defaultViewport={defaultViewport}
            elementsSelectable
            onNodeClick={(_, clickedNode) => focusNode(clickedNode.id)}
            onNodeDragStop={(_, draggedNode) => props.onDragNode(draggedNode)}
            onEdgeClick={(_, clickedEdge) => props.onClickEdge(clickedEdge)}
            panOnScroll
            snapGrid={props.snapGrid}
            snapToGrid={props.snapToGrid}
        >
            <Controls
                position="top-right"
                onInteractiveChange={newIntractable => props.setLockDragging(newIntractable)}
            />
            <MiniMap zoomable pannable nodeStrokeWidth={5} nodeClassName={node => node.className || ""} />
            <Background
                variant={backgroundVariant}
                gap={props.backgroundGap}
                lineWidth={backgroundVariant === BackgroundVariant.Lines ? props.backgroundSize : undefined}
                size={backgroundVariant !== BackgroundVariant.Lines ? props.backgroundSize : undefined}
            />
        </ReactFlow>
    );
};

export default Flow;

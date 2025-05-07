import { ReactElement, createElement, useMemo, useEffect, useState } from "react";
import {
    Controls,
    MiniMap,
    Panel,
    ReactFlow,
    Edge,
    Node,
    Viewport,
    useReactFlow,
    Background,
    useEdgesState,
    useNodesState
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomNode";
import { DefaultViewTypeEnum } from "../../typings/ReactFlowTsProps";
import NavPanel from "./NavPanel";
import Clamp from "../utils/Clamp";

const nodeTypes = {
    customNode: CustomNode
};

export interface FlowProps {
    // System
    tabIndex?: number;

    // Nodes
    nodes: Node[];

    // Edges
    edges: Edge[];

    // Styling
    defaultViewType: DefaultViewTypeEnum;
    defaultZoom: number;
    navZoom: number;

    // Actions
    onClickNode: (clickedNode: Node) => void;
    onClickEdge: (clickedEdge: Edge) => void;
}

const Flow = (props: FlowProps): ReactElement => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    useEffect(() => setNodes(props.nodes), [props.nodes]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    useEffect(() => setEdges(props.edges), [props.edges]);

    const defaultViewport: Viewport = useMemo(
        () => ({ x: 400, y: 0, zoom: Clamp(props.defaultZoom, 0.5, 2) }),
        [props.defaultZoom]
    );
    const { fitView } = useReactFlow();
    const [focusIndex, setFocusIndex] = useState<number | null>(null);

    useEffect(() => {
        if (focusIndex !== null) {
            const focusedNode = props.nodes[focusIndex];
            if (focusedNode !== null) {
                props.onClickNode(focusedNode);
                fitView({
                    nodes: [{ id: focusedNode.id }],
                    duration: 500,
                    maxZoom: Clamp(props.navZoom, 0.5, 2),
                    minZoom: Clamp(props.navZoom, 0.5, 2)
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusIndex, fitView]); // props.onClickNode cannot be in dependency arrays

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
            onNodeClick={(_, clickedNode) => setFocusIndex(props.nodes.findIndex(iNode => iNode.id === clickedNode.id))}
            onEdgeClick={(_, clickedEdge) => props.onClickEdge(clickedEdge)}
            panOnScroll
        >
            <NavPanel focusIndex={focusIndex} setFocusIndex={setFocusIndex} nodesCount={props.nodes.length}></NavPanel>
            <Controls />
            <Panel position="bottom-center">
                <div className="legend">
                    <div>Relation</div>
                    <div>Links</div>
                    <div>Quality Violation</div>
                </div>
            </Panel>
            <MiniMap zoomable pannable nodeStrokeWidth={5} />
            <Background />
        </ReactFlow>
    );
};

export default Flow;

import { ReactElement, createElement, useMemo, useEffect, useCallback } from "react";
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
    useNodesState,
    useStoreApi
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomNode";
import { DefaultViewTypeEnum } from "../../typings/ReactFlowTsProps";
import Clamp from "../utils/Clamp";
import MxIcon from "./mxIcon";

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
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    useEffect(() => setEdges(props.edges), [props.edges]);

    const store = useStoreApi();
    const { resetSelectedElements, addSelectedNodes } = store.getState();

    const defaultViewport: Viewport = useMemo(
        () => ({ x: 400, y: 0, zoom: Clamp(props.defaultZoom, 0.5, 2) }),
        [props.defaultZoom]
    );
    const { fitView } = useReactFlow();

    const focusNode = useCallback(
        (nodeId: string) => {
            const focusedNode = props.nodes.find(node => node.id === nodeId);
            if (focusedNode) {
                console.info(`Attempting to focus node`, focusedNode);
                resetSelectedElements();
                addSelectedNodes([focusedNode.id]);
                props.onClickNode(focusedNode);
                fitView({
                    nodes: [{ id: focusedNode.id }],
                    duration: 500,
                    maxZoom: Clamp(props.navZoom, 0.5, 2),
                    minZoom: Clamp(props.navZoom, 0.5, 2)
                });
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [fitView, props.nodes, Clamp, resetSelectedElements, addSelectedNodes]
    ); // props.onClickNode cannot be in dependency arrays

    useEffect(() => {
        const customFunctionedNodes = props.nodes.map(node => {
            node.data.focusNode = focusNode;
            return node;
        });
        setNodes(customFunctionedNodes);
    }, [props.nodes, focusNode]);

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
            onEdgeClick={(_, clickedEdge) => props.onClickEdge(clickedEdge)}
            panOnScroll
        >
            <Panel position="center-left">
                <div className="nav-panel">
                    <button title="Navigate to Top" onClick={() => focusNode(props.nodes[0].id)}>
                        <MxIcon className="mx-icon-lined mx-icon-arrow-up" isGlyph={false} />
                    </button>
                    <button
                        title="Navigate to Bottom"
                        onClick={() => focusNode(props.nodes[props.nodes.length - 1].id)}
                    >
                        <MxIcon className="mx-icon-lined mx-icon-arrow-down" isGlyph={false} />
                    </button>
                </div>
            </Panel>
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

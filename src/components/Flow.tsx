import { ReactElement, createElement, useMemo, useEffect, useState } from "react";
import { Controls, MiniMap, Panel, ReactFlow, Edge, Node, Viewport, useReactFlow, Background } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomNode";
import { DefaultViewTypeEnum } from "../../typings/ReactFlowTsProps";
import NavPanel from "./NavPanel";

const nodeTypes = {
    customNode: CustomNode
};

export interface FlowProps {
    //System
    tabIndex?: number;

    //Nodes
    nodes: Node[];

    //Edges
    edges: Edge[];

    //Styling
    defaultViewType: DefaultViewTypeEnum;
    defaultZoom: number;

    //Actions
    onClickNode: (clickedNode: Node) => void;
    onClickEdge: (clickedEdge: Edge) => void;
}

const Flow = (props: FlowProps): ReactElement => {
    const defaultViewport: Viewport = useMemo(() => ({ x: 400, y: 0, zoom: props.defaultZoom }), [props.defaultZoom]);
    const { fitView } = useReactFlow();
    const [focusIndex, setFocusIndex] = useState<number | null>(null);

    useEffect(() => {
        if (focusIndex !== null) {
            const focusedNode = props.nodes[focusIndex];
            if (focusedNode !== null) {
                props.onClickNode(focusedNode);
                fitView({ nodes: [{ id: focusedNode.id }], duration: 500, maxZoom: 1, minZoom: 1 });
            }
        }
    }, [focusIndex, fitView]);

    return (
        <ReactFlow
            nodes={props.nodes}
            edges={props.edges}
            nodeTypes={nodeTypes}
            fitView={props.defaultViewType === "FULL"}
            defaultViewport={defaultViewport}
            elementsSelectable={true}
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

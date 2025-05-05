import { ReactElement, createElement, CSSProperties } from "react";
import { Controls, MiniMap, Panel, ReactFlow, ReactFlowProvider, Edge, Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import classNames from "classnames";

export interface ReactFlowCompProps {
    //System
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;

    //Nodes
    nodes: Node[];

    //Edges
    edges: Edge[];

    //Actions
    onClickNode: (clickedNode: Node) => void;
    onClickEdge: (clickedEdge: Edge) => void;
}

const ReactFlowComp = (props: ReactFlowCompProps): ReactElement => {
    return (
        <div
            id={props.name}
            className={classNames("mendix-react-flow", props.class)}
            style={{ width: "50vw", height: "75vh", ...props.style }}
        >
            <ReactFlowProvider>
                <ReactFlow
                    nodes={props.nodes}
                    edges={props.edges}
                    fitView
                    elementsSelectable={true}
                    onNodeClick={(_, clickedNode) => props.onClickNode(clickedNode)}
                    onEdgeClick={(_, clickedEdge) => props.onClickEdge(clickedEdge)}
                >
                    <Controls />
                    <Panel position="bottom-center">
                        <div className="legend">
                            <div>Relation</div>
                            <div>Links</div>
                            <div>Quality Violation</div>
                        </div>
                    </Panel>
                    <MiniMap zoomable pannable nodeStrokeWidth={3} />
                </ReactFlow>
                {/* <Sidebar /> */}
            </ReactFlowProvider>
        </div>
    );
};

export default ReactFlowComp;

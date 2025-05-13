import { ReactElement, createElement, CSSProperties } from "react";
import { Edge, Node, ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import classNames from "classnames";
import { BackgroundTypeEnum, DefaultViewTypeEnum } from "../../typings/ReactFlowTsProps";
import Flow from "./Flow";

export interface FlowProviderProps {
    // System
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;

    // Nodes
    nodes: Node[];
    focusedNodeOverride: string | undefined;

    // Edges
    edges: Edge[];

    // Styling
    containerWidth: string;
    containerHeight: string;
    defaultViewType: DefaultViewTypeEnum;
    defaultZoom: number;
    navZoom: number;

    //Background
    backgroundType: BackgroundTypeEnum;
    backgroundGap: number;
    backgroundSize: number;

    // Actions
    onClickNode: (clickedNode: Node) => void;
    onDragNode: (draggedNode: Node) => void;
    onClickEdge: (clickedEdge: Edge) => void;
}

const FlowProvider = (props: FlowProviderProps): ReactElement => {
    return (
        <div
            id={props.name}
            className={classNames("mendix-react-flow", props.class)}
            // Library requires parent to have a set width & height
            style={{ width: props.containerWidth, height: props.containerHeight, ...props.style }}
        >
            <ReactFlowProvider>
                <Flow {...props} />
            </ReactFlowProvider>
        </div>
    );
};

export default FlowProvider;

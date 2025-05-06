import { ReactElement, createElement, CSSProperties } from "react";
import { Edge, Node, ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import classNames from "classnames";
import { DefaultViewTypeEnum } from "../../typings/ReactFlowTsProps";
import Flow from "./Flow";

export interface FlowProviderProps {
    //System
    name: string;
    class: string;
    style?: CSSProperties;
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

const FlowProvider = (props: FlowProviderProps): ReactElement => {
    return (
        <div
            id={props.name}
            className={classNames("mendix-react-flow", props.class)}
            //Library requires parent to have a set width & height
            style={{ width: "50vw", height: "75vh", ...props.style }}
        >
            <ReactFlowProvider>
                <Flow {...props} />
                {/* <Sidebar /> */}
            </ReactFlowProvider>
        </div>
    );
};

export default FlowProvider;

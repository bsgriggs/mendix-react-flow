import { ReactElement, createElement } from "react";
import ReactFlowComp from "./components/ReactFlowComp";
import { ReactFlowTsPreviewProps } from "../typings/ReactFlowTsProps";

export function preview(props: ReactFlowTsPreviewProps): ReactElement {
    return (
        <ReactFlowComp
            // System
            name={"preview"}
            class={props.class}
            style={props.styleObject}
            // Nodes
            nodes={[
                {
                    id: "1",
                    type: "input",
                    data: { label: "Start here..." },
                    position: { x: -150, y: 0 }
                },
                {
                    id: "2",
                    type: "input",
                    data: { label: "...or here!" },
                    position: { x: 150, y: 0 }
                },
                { id: "3", data: { label: "Then me!" }, position: { x: 0, y: 100 } }
            ]}
            // Edges
            edges={[
                { id: "1->3", source: "1", target: "3" },
                { id: "2->3", source: "2", target: "3" }
            ]}
            // Actions
            onClickNode={clickedNode => console.debug(`clicked node ${clickedNode}`)}
            onClickEdge={clickedEdge => console.debug(`clicked edge ${clickedEdge}`)}
        />
    );
}

export function getPreviewCss(): string {
    return require("./ui/ReactFlowTs.css");
}

import { ReactElement, createElement } from "react";
import FlowProvider from "./components/FlowProvider";
import { ReactFlowTsPreviewProps } from "../typings/ReactFlowTsProps";

export function preview(props: ReactFlowTsPreviewProps): ReactElement {
    const nodeRenderer = props.nodeContent.renderer;

    return (
        <FlowProvider
            // System
            name={"preview"}
            class={props.class}
            style={props.styleObject}
            setLockDragging={newDraggable => console.debug(`draggable now ${newDraggable}`)}
            // Nodes
            nodes={[
                {
                    id: "1",
                    type: "input",
                    data: { label: "Start here...", children: nodeRenderer },
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
            focusedNodeOverride={undefined}
            // Edges
            edges={[
                { id: "1->3", source: "1", target: "3" },
                { id: "2->3", source: "2", target: "3" }
            ]}
            // Style
            containerWidth="100%"
            containerHeight="75vh"
            defaultViewType="ZOOM"
            defaultZoom={1}
            navZoom={1}
            snapToGrid={false}
            snapGrid={[50, 50]}
            // Background
            backgroundGap={50}
            backgroundType={props.backgroundType}
            backgroundSize={props.backgroundType === "CROSSES" ? 6 : props.backgroundType === "DOTS" ? 1 : 1}
            // Actions
            onClickNode={clickedNode => console.debug(`clicked node ${clickedNode}`)}
            onDragNode={draggedNode => console.debug(`dragged node ${draggedNode}`)}
            onClickEdge={clickedEdge => console.debug(`clicked edge ${clickedEdge}`)}
        />
    );
}

export function getPreviewCss(): string {
    return require("./ui/ReactFlowTs.css");
}

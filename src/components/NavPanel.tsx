import { ReactElement, createElement } from "react";
import { Panel } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export interface NavPanelProps {
    nodesCount: number;
    focusIndex: number | null;
    setFocusIndex: (newIndex: number) => void;
}

const NavPanel = (props: NavPanelProps): ReactElement => {
    console.info("NavPanelProps", props);
    return (
        <Panel position="center-left">
            <div className="nav-panel">
                <button
                    onClick={() => {
                        if (props.nodesCount > 0) {
                            props.setFocusIndex(0);
                        }
                    }}
                >
                    Go to top
                </button>
                <button
                    onClick={() => {
                        if (props.focusIndex === null) {
                            props.setFocusIndex(0);
                        } else if (props.focusIndex > 0) {
                            props.setFocusIndex(props.focusIndex - 1);
                        } else {
                            props.setFocusIndex(props.nodesCount - 1);
                        }
                    }}
                >
                    Go up 1
                </button>
                <div>{`${props.focusIndex === null ? "" : props.focusIndex + 1} / ${props.nodesCount}`}</div>
                <button
                    onClick={() => {
                        if (props.focusIndex === null || props.focusIndex === props.nodesCount - 1) {
                            props.setFocusIndex(0);
                        } else if (props.focusIndex < props.nodesCount) {
                            props.setFocusIndex(props.focusIndex + 1);
                        }
                    }}
                >
                    Go down 1
                </button>

                <button
                    onClick={() => {
                        if (props.nodesCount > 0) {
                            props.setFocusIndex(props.nodesCount - 1);
                        }
                    }}
                >
                    Go to bottom
                </button>
            </div>
        </Panel>
    );
};

export default NavPanel;

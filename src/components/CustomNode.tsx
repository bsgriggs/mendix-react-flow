import { Handle, Position, useEdges } from "@xyflow/react";
import classNames from "classnames";
import { ReactElement, createElement, memo, useMemo, MouseEvent } from "react";
import MxIcon from "./mxIcon";

export interface CustomNodeProps {
    id: string;
    data: any;
    deletable: boolean;
    draggable: boolean;
    isConnectable: boolean;
    selected: boolean;
}

export default memo((props: CustomNodeProps): ReactElement => {
    const edges = useEdges();
    const nodesTargetingThis: string[] = useMemo(
        () => edges.filter(edge => edge.target === props.id).map(edge => edge.source),
        [edges, props.id]
    );
    const nodesSourcingThis: string[] = useMemo(
        () => edges.filter(edge => edge.source === props.id).map(edge => edge.target),
        [edges, props.id]
    );

    const handleClickNav = (event: MouseEvent<HTMLButtonElement>, nodeId: string): void => {
        event.stopPropagation(); // prevent clicking the button from selecting THIS node
        props.data.focusNode(nodeId);
    };

    return (
        <div className={classNames("custom-node", { selected: props.selected }, { nodrag: !props.draggable })}>
            {nodesTargetingThis.length > 0 && (
                <Handle type="target" position={Position.Top} isConnectable={false} draggable={false} />
            )}

            <div className="target-btns">
                {nodesTargetingThis.map(nodeId => (
                    <button
                        key={nodeId}
                        className="btn mx-button"
                        title="Navigate Up"
                        onClick={event => handleClickNav(event, nodeId)}
                    >
                        <MxIcon className="mx-icon-lined mx-icon-chevron-up" isGlyph={false} />
                    </button>
                ))}
            </div>
            <div className="node-content">{props.data.children}</div>
            <div className="source-btns">
                {nodesSourcingThis.map(nodeId => (
                    <button
                        key={nodeId}
                        className="btn mx-button"
                        title="Navigate Down"
                        onClick={event => handleClickNav(event, nodeId)}
                    >
                        <MxIcon className="mx-icon-lined mx-icon-chevron-down" isGlyph={false} />
                    </button>
                ))}
            </div>
            {nodesSourcingThis.length > 0 && (
                <Handle type="source" position={Position.Bottom} isConnectable={false} draggable={false} />
            )}
        </div>
    );
});

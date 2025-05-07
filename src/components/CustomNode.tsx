import { Handle, Position } from "@xyflow/react";
import classNames from "classnames";
import { ReactElement, createElement, memo } from "react";

export interface CustomNodeProps {
    data: any;
    deletable: boolean;
    draggable: boolean;
    isConnectable: boolean;
    selected: boolean;
}

export default memo((props: CustomNodeProps): ReactElement => {
    return (
        <div className={classNames("custom-node", { selected: props.selected }, { nodrag: !props.draggable })}>
            <Handle type="target" position={Position.Top} isConnectable={false} draggable={false} />
            <div className="node-content">{props.data.children}</div>
            <Handle type="source" position={Position.Bottom} isConnectable={false} draggable={false} />
        </div>
    );
});

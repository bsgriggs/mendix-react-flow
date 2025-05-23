import { Handle, Position, useEdges, useUpdateNodeInternals, NodeToolbar } from "@xyflow/react";
import classNames from "classnames";
import { ReactElement, createElement, memo, useState, useEffect, Fragment } from "react";
import NavButton from "./NavButton";

export interface CustomNodeProps {
    id: string;
    data: any;
    deletable: boolean;
    draggable: boolean;
    isConnectable: boolean;
    selected: boolean;
}

interface EdgeHandle {
    nodeId: string;
    showNavButtons: boolean;
    label?: string;
}

interface IHandles {
    top: EdgeHandle[];
    right: EdgeHandle[];
    bottom: EdgeHandle[];
    left: EdgeHandle[];
}

const DEFAULT_HANDLES: IHandles = {
    top: [],
    right: [],
    bottom: [],
    left: []
};

const NAV_BTN_OFFSET: number = -5;

export default memo((props: CustomNodeProps): ReactElement => {
    const [sourceHandles, setSourceHandles] = useState<IHandles>(DEFAULT_HANDLES);
    const [targetHandles, setTargetHandles] = useState<IHandles>(DEFAULT_HANDLES);
    const edges = useEdges();
    const updateNodeInternals = useUpdateNodeInternals();

    useEffect(() => {
        const newSourceHandle: IHandles = structuredClone(DEFAULT_HANDLES);
        const newTargetHandle: IHandles = structuredClone(DEFAULT_HANDLES);
        //removed .filter because forEach also needs to check source vs target; avoid extra loops
        edges.forEach(edge => {
            if (edge.target === props.id) {
                let newEdgeHandle: EdgeHandle = {
                    label: `${edge.data?.sourceLabel}`,
                    showNavButtons: edge.data?.showNavButtons === true,
                    nodeId: edge.source
                };
                if (edge.targetHandle === "target-Top") {
                    newSourceHandle.top.push(newEdgeHandle);
                } else if (edge.targetHandle === "target-Right") {
                    newSourceHandle.right.push(newEdgeHandle);
                } else if (edge.targetHandle === "target-Bottom") {
                    newSourceHandle.bottom.push(newEdgeHandle);
                } else if (edge.targetHandle === "target-Left") {
                    newSourceHandle.left.push(newEdgeHandle);
                }
            } else if (edge.source === props.id) {
                let newEdgeHandle: EdgeHandle = {
                    label: `${edge.data?.targetLabel}`,
                    showNavButtons: edge.data?.showNavButtons === true,
                    nodeId: edge.target
                };
                if (edge.sourceHandle === "source-Top") {
                    newTargetHandle.top.push(newEdgeHandle);
                } else if (edge.sourceHandle === "source-Right") {
                    newTargetHandle.right.push(newEdgeHandle);
                } else if (edge.sourceHandle === "source-Bottom") {
                    newTargetHandle.bottom.push(newEdgeHandle);
                } else if (edge.sourceHandle === "source-Left") {
                    newTargetHandle.left.push(newEdgeHandle);
                }
            }
        });
        setSourceHandles(newSourceHandle);
        setTargetHandles(newTargetHandle);

        updateNodeInternals(props.id);
    }, [edges, props.id, updateNodeInternals]);

    return (
        <div className={classNames("custom-node", { selected: props.selected }, { nodrag: !props.draggable })}>
            <Handle
                id="target-Top"
                style={{ opacity: targetHandles.top.length > 0 ? 1 : 0 }}
                type="target"
                position={Position.Top}
                isConnectable={false}
            />
            <Handle
                id="target-Right"
                style={{ opacity: targetHandles.right.length > 0 ? 1 : 0 }}
                type="target"
                position={Position.Right}
                isConnectable={false}
            />
            <Handle
                id="target-Bottom"
                style={{ opacity: targetHandles.bottom.length > 0 ? 1 : 0 }}
                type="target"
                position={Position.Bottom}
                isConnectable={false}
            />
            <Handle
                id="target-Left"
                style={{ opacity: targetHandles.left.length > 0 ? 1 : 0 }}
                type="target"
                position={Position.Left}
                isConnectable={false}
            />

            <div className="node-content">{props.data.children}</div>

            <Handle
                id="source-Top"
                style={{ opacity: sourceHandles.top.length > 0 ? 1 : 0 }}
                type="source"
                position={Position.Top}
                isConnectable={false}
            />
            <Handle
                id="source-Right"
                style={{ opacity: sourceHandles.right.length > 0 ? 1 : 0 }}
                type="source"
                position={Position.Right}
                isConnectable={false}
            />
            <Handle
                id="source-Bottom"
                style={{ opacity: sourceHandles.bottom.length > 0 ? 1 : 0 }}
                type="source"
                position={Position.Bottom}
                isConnectable={false}
            />
            <Handle
                id="source-Left"
                style={{ opacity: sourceHandles.left.length > 0 ? 1 : 0 }}
                type="source"
                position={Position.Left}
                isConnectable={false}
            />

            {props.selected && (
                <Fragment>
                    {targetHandles.top.length + sourceHandles.top.length > 0 && (
                        <NodeToolbar position={Position.Top} offset={NAV_BTN_OFFSET} className="nav-button-array">
                            {targetHandles.top
                                .concat(sourceHandles.top)
                                .filter(edgeHandle => edgeHandle.showNavButtons)
                                .map(edgeHandle => (
                                    <NavButton
                                        key={edgeHandle.nodeId}
                                        nodeId={edgeHandle.nodeId}
                                        title={edgeHandle.label}
                                        iconClassName="mx-icon-chevron-up"
                                    />
                                ))}
                        </NodeToolbar>
                    )}
                    {targetHandles.right.length + sourceHandles.right.length > 0 && (
                        <NodeToolbar position={Position.Right} offset={NAV_BTN_OFFSET} className="nav-button-array">
                            {targetHandles.right
                                .concat(sourceHandles.right)
                                .filter(edgeHandle => edgeHandle.showNavButtons)
                                .map(edgeHandle => (
                                    <NavButton
                                        key={edgeHandle.nodeId}
                                        nodeId={edgeHandle.nodeId}
                                        title={edgeHandle.label}
                                        iconClassName="mx-icon-chevron-right"
                                    />
                                ))}
                        </NodeToolbar>
                    )}
                    {targetHandles.bottom.length + sourceHandles.bottom.length > 0 && (
                        <NodeToolbar position={Position.Bottom} offset={NAV_BTN_OFFSET} className="nav-button-array">
                            {targetHandles.bottom
                                .concat(sourceHandles.bottom)
                                .filter(edgeHandle => edgeHandle.showNavButtons)
                                .map(edgeHandle => (
                                    <NavButton
                                        key={edgeHandle.nodeId}
                                        nodeId={edgeHandle.nodeId}
                                        title={edgeHandle.label}
                                        iconClassName="mx-icon-chevron-down"
                                    />
                                ))}
                        </NodeToolbar>
                    )}
                    {targetHandles.left.length + sourceHandles.left.length > 0 && (
                        <NodeToolbar position={Position.Left} offset={NAV_BTN_OFFSET} className="nav-button-array">
                            {targetHandles.left
                                .concat(sourceHandles.left)
                                .filter(edgeHandle => edgeHandle.showNavButtons)
                                .map(edgeHandle => (
                                    <NavButton
                                        key={edgeHandle.nodeId}
                                        nodeId={edgeHandle.nodeId}
                                        title={edgeHandle.label}
                                        iconClassName="mx-icon-chevron-left"
                                    />
                                ))}
                        </NodeToolbar>
                    )}
                </Fragment>
            )}
            <NodeToolbar
                isVisible={
                    props.data.toolbarType === "ALWAYS" ||
                    (props.data.toolbarType === "SELECTED_ONLY" && props.selected)
                }
                position={
                    props.data.toolbarPosition === "Top"
                        ? Position.Top
                        : props.data.toolbarPosition === "Right"
                        ? Position.Right
                        : props.data.toolbarPosition === "Bottom"
                        ? Position.Bottom
                        : props.data.toolbarPosition === "Left"
                        ? Position.Left
                        : Position.Bottom
                }
                offset={Number(props.data.toolbarGap)}
                align={props.data.toolbarAlignment}
            >
                {props.data.toolbarContent}
            </NodeToolbar>
        </div>
    );
});

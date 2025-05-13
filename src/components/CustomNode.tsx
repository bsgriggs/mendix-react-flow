import { Handle, Position, useEdges, useNodes, Node, useUpdateNodeInternals, NodeToolbar } from "@xyflow/react";
import classNames from "classnames";
import { ReactElement, createElement, memo, MouseEvent, useState, useEffect, Fragment } from "react";
import NavButton from "./NavButton";

export interface CustomNodeProps {
    id: string;
    data: any;
    deletable: boolean;
    draggable: boolean;
    isConnectable: boolean;
    selected: boolean;
}

interface IHandles {
    top: Node[];
    right: Node[];
    bottom: Node[];
    left: Node[];
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
    const nodes = useNodes();
    const updateNodeInternals = useUpdateNodeInternals();

    useEffect(() => {
        const newSourceHandle: IHandles = structuredClone(DEFAULT_HANDLES);
        edges
            .filter(edge => edge.target === props.id)
            .forEach(edge => {
                const sourceNode = nodes.find(node => node.id === edge.source);
                if (sourceNode) {
                    if (edge.targetHandle === "target-Top") {
                        newSourceHandle.top.push(sourceNode);
                    } else if (edge.targetHandle === "target-Right") {
                        newSourceHandle.right.push(sourceNode);
                    } else if (edge.targetHandle === "target-Bottom") {
                        newSourceHandle.bottom.push(sourceNode);
                    } else if (edge.targetHandle === "target-Left") {
                        newSourceHandle.left.push(sourceNode);
                    }
                }
            });
        setSourceHandles(newSourceHandle);

        const newTargetHandle: IHandles = structuredClone(DEFAULT_HANDLES);
        edges
            .filter(edge => edge.source === props.id)
            .forEach(edge => {
                const targetNode = nodes.find(node => node.id === edge.target);
                if (targetNode) {
                    if (edge.sourceHandle === "source-Top") {
                        newTargetHandle.top.push(targetNode);
                    } else if (edge.sourceHandle === "source-Right") {
                        newTargetHandle.right.push(targetNode);
                    } else if (edge.sourceHandle === "source-Bottom") {
                        newTargetHandle.bottom.push(targetNode);
                    } else if (edge.sourceHandle === "source-Left") {
                        newTargetHandle.left.push(targetNode);
                    }
                }
            });
        setTargetHandles(newTargetHandle);
        updateNodeInternals(props.id);
    }, [edges, nodes, props.id, updateNodeInternals]);

    const handleClickNav = (event: MouseEvent<HTMLButtonElement>, nodeId: string): void => {
        event.stopPropagation(); // prevent clicking the button from selecting THIS node
        (window as any).reactFlowFocus(nodeId);
    };

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
                            {targetHandles.top.concat(sourceHandles.top).map(node => (
                                <NavButton
                                    key={node.id}
                                    node={node}
                                    iconClassName="mx-icon-chevron-up"
                                    onClick={handleClickNav}
                                />
                            ))}
                        </NodeToolbar>
                    )}
                    {targetHandles.right.length + sourceHandles.right.length > 0 && (
                        <NodeToolbar position={Position.Right} offset={NAV_BTN_OFFSET} className="nav-button-array">
                            {targetHandles.right.concat(sourceHandles.right).map(node => (
                                <NavButton
                                    key={node.id}
                                    node={node}
                                    iconClassName="mx-icon-chevron-right"
                                    onClick={handleClickNav}
                                />
                            ))}
                        </NodeToolbar>
                    )}
                    {targetHandles.bottom.length + sourceHandles.bottom.length > 0 && (
                        <NodeToolbar position={Position.Bottom} offset={NAV_BTN_OFFSET} className="nav-button-array">
                            {targetHandles.bottom.concat(sourceHandles.bottom).map(node => (
                                <NavButton
                                    key={node.id}
                                    node={node}
                                    iconClassName="mx-icon-chevron-down"
                                    onClick={handleClickNav}
                                />
                            ))}
                        </NodeToolbar>
                    )}
                    {targetHandles.left.length + sourceHandles.left.length > 0 && (
                        <NodeToolbar position={Position.Left} offset={NAV_BTN_OFFSET} className="nav-button-array left">
                            {targetHandles.left.concat(sourceHandles.left).map(node => (
                                <NavButton
                                    key={node.id}
                                    node={node}
                                    iconClassName="mx-icon-chevron-left"
                                    onClick={handleClickNav}
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

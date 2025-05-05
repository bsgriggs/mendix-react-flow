/**
 * This file was generated from ReactFlowTs.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ListValue, ListActionValue, ListExpressionValue, SelectionSingleValue } from "mendix";

export interface ReactFlowTsContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    nodes: ListValue;
    selectedNode: SelectionSingleValue;
    nodeId: ListExpressionValue<string>;
    nodeLabel: ListExpressionValue<string>;
    edges: ListValue;
    edgeId: ListExpressionValue<string>;
    nodeSourceId: ListExpressionValue<string>;
    nodeTargetId: ListExpressionValue<string>;
    onClickNode?: ListActionValue;
    onClickEdge?: ListActionValue;
}

export interface ReactFlowTsPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode?: "design" | "xray" | "structure";
    nodes: {} | { caption: string } | { type: string } | null;
    selectedNode: "Single";
    nodeId: string;
    nodeLabel: string;
    edges: {} | { caption: string } | { type: string } | null;
    edgeId: string;
    nodeSourceId: string;
    nodeTargetId: string;
    onClickNode: {} | null;
    onClickEdge: {} | null;
}

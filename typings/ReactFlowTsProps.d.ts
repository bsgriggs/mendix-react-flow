/**
 * This file was generated from ReactFlowTs.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { DynamicValue, ListValue, ListActionValue, ListExpressionValue, ListWidgetValue, SelectionSingleValue } from "mendix";
import { Big } from "big.js";

export type DefaultViewTypeEnum = "FULL" | "ZOOM";

export interface ReactFlowTsContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    nodes: ListValue;
    selectedNode: SelectionSingleValue;
    nodeId: ListExpressionValue<string>;
    nodeContent: ListWidgetValue;
    nodePosX: ListExpressionValue<Big>;
    nodePosY: ListExpressionValue<Big>;
    nodeClassName?: ListExpressionValue<string>;
    edges: ListValue;
    edgeId: ListExpressionValue<string>;
    nodeSourceId: ListExpressionValue<string>;
    nodeTargetId: ListExpressionValue<string>;
    lineType: ListExpressionValue<string>;
    containerWidth: DynamicValue<string>;
    containerHeight: DynamicValue<string>;
    defaultViewType: DefaultViewTypeEnum;
    defaultZoom: DynamicValue<Big>;
    navZoom: DynamicValue<Big>;
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
    nodeContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    nodePosX: string;
    nodePosY: string;
    nodeClassName: string;
    edges: {} | { caption: string } | { type: string } | null;
    edgeId: string;
    nodeSourceId: string;
    nodeTargetId: string;
    lineType: string;
    containerWidth: string;
    containerHeight: string;
    defaultViewType: DefaultViewTypeEnum;
    defaultZoom: string;
    navZoom: string;
    onClickNode: {} | null;
    onClickEdge: {} | null;
}

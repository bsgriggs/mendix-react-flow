/**
 * This file was generated from ReactFlowTs.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { DynamicValue, ListValue, ListActionValue, ListExpressionValue, ListWidgetValue, SelectionSingleValue } from "mendix";
import { Big } from "big.js";

export type SnapToGridEnum = "OFF" | "BACKGROUND" | "CUSTOM";

export type DefaultViewTypeEnum = "ZOOM" | "FULL";

export type BackgroundTypeEnum = "CROSSES" | "DOTS" | "LINES";

export interface ReactFlowTsContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    nodes: ListValue;
    selectedNode: SelectionSingleValue;
    nodeId: ListExpressionValue<string>;
    nodeLabel: ListExpressionValue<string>;
    nodeContent: ListWidgetValue;
    nodePosX: ListExpressionValue<Big>;
    nodePosY: ListExpressionValue<Big>;
    nodeWidth?: ListExpressionValue<Big>;
    nodeHeight?: ListExpressionValue<Big>;
    snapToGrid: SnapToGridEnum;
    snapGridX: DynamicValue<Big>;
    snapGridY: DynamicValue<Big>;
    nodeClassName?: ListExpressionValue<string>;
    focusedNodeOverride?: DynamicValue<string>;
    allowDragging: ListExpressionValue<boolean>;
    edges: ListValue;
    edgeLabel?: ListExpressionValue<string>;
    nodeSourceId: ListExpressionValue<string>;
    sourceLineSide: ListExpressionValue<string>;
    nodeTargetId: ListExpressionValue<string>;
    targetLineSide: ListExpressionValue<string>;
    edgeClassName?: ListExpressionValue<string>;
    arrowType: ListExpressionValue<string>;
    lineType: ListExpressionValue<string>;
    curveType: ListExpressionValue<string>;
    containerWidth: DynamicValue<string>;
    containerHeight: DynamicValue<string>;
    loadingContent: ReactNode;
    defaultViewType: DefaultViewTypeEnum;
    defaultZoom: DynamicValue<Big>;
    navZoom: DynamicValue<Big>;
    backgroundType: BackgroundTypeEnum;
    backgroundGap: DynamicValue<Big>;
    dotSize: DynamicValue<Big>;
    crossSize: DynamicValue<Big>;
    lineWidth: DynamicValue<Big>;
    onClickNode?: ListActionValue;
    onDragNode?: ListActionValue;
    onClickEdge?: ListActionValue;
    nodeAriaLabel?: ListExpressionValue<string>;
    edgeAriaLabel?: ListExpressionValue<string>;
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
    nodeContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    nodePosX: string;
    nodePosY: string;
    nodeWidth: string;
    nodeHeight: string;
    snapToGrid: SnapToGridEnum;
    snapGridX: string;
    snapGridY: string;
    nodeClassName: string;
    focusedNodeOverride: string;
    allowDragging: string;
    edges: {} | { caption: string } | { type: string } | null;
    edgeLabel: string;
    nodeSourceId: string;
    sourceLineSide: string;
    nodeTargetId: string;
    targetLineSide: string;
    edgeClassName: string;
    arrowType: string;
    lineType: string;
    curveType: string;
    containerWidth: string;
    containerHeight: string;
    loadingContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    defaultViewType: DefaultViewTypeEnum;
    defaultZoom: string;
    navZoom: string;
    backgroundType: BackgroundTypeEnum;
    backgroundGap: string;
    dotSize: string;
    crossSize: string;
    lineWidth: string;
    onClickNode: {} | null;
    onDragNode: {} | null;
    onClickEdge: {} | null;
    nodeAriaLabel: string;
    edgeAriaLabel: string;
}

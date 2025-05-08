import { createElement, ReactElement } from "react";

interface IconProps {
    title?: string;
    className: string;
    isGlyph: boolean;
}

const MxIcon = (props: IconProps): ReactElement =>
    props.isGlyph ? (
        <span className={`glyphicon glyphicon-${props.className}`} aria-hidden="true" title={props.title} />
    ) : (
        <span className={props.className} aria-hidden="true" title={props.title}></span>
    );

export default MxIcon;

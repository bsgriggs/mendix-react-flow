import { ReactElement, createElement, MouseEvent } from "react";
import MxIcon from "./mxIcon";

export interface NavButtonProps {
    nodeId: string;
    title?: string;
    onClick: (event: MouseEvent<HTMLButtonElement>, nodeId: string) => void;
    iconClassName: string;
}

const NavButton = (props: NavButtonProps): ReactElement => (
    <button className="btn mx-button nav-btn" title={props.title} onClick={event => props.onClick(event, props.nodeId)}>
        <MxIcon className={`mx-icon-lined ${props.iconClassName}`} isGlyph={false} />
    </button>
);

export default NavButton;

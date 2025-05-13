import { ReactElement, createElement, MouseEvent } from "react";
import MxIcon from "./mxIcon";
import { Node } from "@xyflow/react";

export interface NavButtonProps {
    node: Node;
    onClick: (event: MouseEvent<HTMLButtonElement>, nodeId: string) => void;
    iconClassName: string;
}

const NavButton = (props: NavButtonProps): ReactElement => (
    <button
        className="btn mx-button nav-btn"
        title={`Navigate to ${props.node.data.label}`}
        onClick={event => props.onClick(event, props.node.id)}
    >
        <MxIcon className={`mx-icon-lined ${props.iconClassName}`} isGlyph={false} />
    </button>
);

export default NavButton;

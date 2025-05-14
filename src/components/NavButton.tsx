import { ReactElement, createElement } from "react";
import MxIcon from "./mxIcon";

export interface NavButtonProps {
    nodeId: string;
    title?: string;
    iconClassName: string;
}

const NavButton = (props: NavButtonProps): ReactElement => (
    <button
        className="btn mx-button nav-btn"
        title={props.title}
        onClick={event => {
            event.stopPropagation(); // prevent clicking the button from selecting THIS node
            (window as any).reactFlowFocus(props.nodeId);
        }}
    >
        <MxIcon className={`mx-icon-lined ${props.iconClassName}`} isGlyph={false} />
    </button>
);

export default NavButton;

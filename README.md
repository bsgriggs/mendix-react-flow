## React Flow for Mendix
Implementation of the [React Flow library](https://reactflow.dev/) for Mendix

![demo](https://github.com/bsgriggs/mendix-react-flow/blob/media/demo.png)  

![studioProDefault](https://github.com/bsgriggs/mendix-react-flow/blob/media/studioProDefault.png)  

## Features
- Display linked data with dynamic content
- Control over the positions and sizes of each node
- Ability to have nodes draggable (changes not saved)
- Nodes can be set to snap to a grid
- Provides an area to add custom buttons near a node (AKA Toolbar)
- Buttons to navigate through the nodes
- Ability to focus a specific node from outside the widget
- The selected node can be shown in a Data View using the 'List to Widget' option ([Mendix 10.7+](https://docs.mendix.com/apidocs-mxsdk/apidocs/pluggable-widgets-property-types/#selection))
- Can set which side of a node each line starts and ends at
- Control over the type of Arrow, line, or curve for every line independently
- Dynamic CSS classnames for each node & edge
- Can set the Default zoom
- Background is configurable with Crosses, Dots, or Lines. The size and spacing of each are also customizable.
- Events for clicking a specific node or edge
- Event for when a node is dragged
- Provides an area to display custom loading content, like a [spinner](https://marketplace.mendix.com/link/component/204096)


## Limitations
- The widget only handles the rendering of nodes. The developer must write their own logic to position the nodes.
- Dragging nodes is allowed, but the new positions cannot be saved.
- Only 1 widget should be rendered per page
- The widget CANNOT be in a non-default tab of a tab container.

## Future Enhancements
- Add an on-drag callback for setting position values to the node using [10.15+ Action Variables](https://docs.mendix.com/apidocs-mxsdk/apidocs/pluggable-widgets-property-types/#studio-pro-ui-10)

## Data Structures
The following is the MINIMUM recommended data structure.  
![domainMin](https://github.com/bsgriggs/mendix-react-flow/blob/media/domainMin.png)  
### React Flow Helper
1. A helper object for applying scaling and providing a way to store all nodes and edges.
2. Integers for scaling X & Y positions. See Node #3 below.
3. A string attribute for setting a particular Node ID to focus by default and/or changing the current focus.
### Node
A node is one cell in the chart.
1. An ID that is unique across ALL nodes.
2. A user-friendly description of the node.
3. The X and Y positions of the node. The recommendation is to have these values as a basic coordinate system. For example, (0, 1) or (2, 4). Then, the helper will scale the basic coordinates when passed to the widget, like (300, 175). This is so the coordinates are easier to calculate in Studio Pro. The node directly below (2, 1) is just y+1 (2, 2), and then will scale to (600, 175) and (600, 350).

### Edge
Defines the lines that connect 2 nodes, where those connections touch each node, and what that line looks like.
1. The label is optional. It displays text at the mid-point of the line.
2. The Source and Target Node IDs must match two existing Node ID's exactly.

### Expanding the Data Structure
The node entity can be expanded to include more data specific to the use case. For example, Nodes could have Latitude and Longitude attributes with a List to Widget Data View to display a map for the selected node.

Both Node and Edge can be extended to include more control for each node and edge. Here are just a few examples. Many of the widget's settings are designed to be easily controllable by an attribute.  
![domainFull](https://github.com/bsgriggs/mendix-react-flow/blob/media/domainFull.png)  

## Usage
The widget has the following properties panels.
### Nodes
![nodes](https://github.com/bsgriggs/mendix-react-flow/blob/media/nodes.png)  
**Data**  
The Nodes List can be any object. This object will be used to evaluate ALL the other expressions on this tab.  
The Node ID MUST BE UNIQUE across all nodes. The Label should be a user-friendly description of the node. It is displayed as the title of the navigation buttons

**Positions**  
The recommendation is to have the Node objects store a simple coordinate system and then apply scaling in the widget. This makes it easier to manage the positions, and adjustments to the scale can be done all in one place. For example, the nodes could have positions (0,0) (0,1) (1,2) and scaling (400, 175), resulting in the final positions (0,0) (0, 175), and (400, 350).  

**Size**  
These are OPTIONAL fixed-width and fixed-height values. If no value is provided, the library uses fit-content for each node.  

**Grid Snapping**  
When the user drags a node, the node can be set to snap to a grid.  
- With 'Same as Background', the snapping will follow the `Customization -> Background -> Gap` property.
- With 'Custom', two new X and Y gap properties will display to define the grid to snap on:

![nodes_GridSnap](https://github.com/bsgriggs/mendix-react-flow/blob/media/nodes_GridSnap.png)  

**Node Toolbar**  
The toolbar is an easy way to display custom buttons/data relative to each node. As an example, put an edit button for a node at "Top" and "end".  
![demo_Toolbar](https://github.com/bsgriggs/mendix-react-flow/blob/media/demo_Toolbar.png)  
When enabled, the following settings will display. These define where to place the toolbar relative to each node.  
![nodes_Toolbar](https://github.com/bsgriggs/mendix-react-flow/blob/media/nodes_Toolbar.png)  

On the Studio Pro page, a new section will appear for the content of the toolbar relative to each node.  
![nodes_ToolbarStudioPro](https://github.com/bsgriggs/mendix-react-flow/blob/media/nodes_ToolbarStudioPro.png)  

**Focus Override**  
This setting allows control of the focused node outside the widget. The widget only watches for when the value changes and then tries to find the matching node by its ID.  
A node can also be focused outside the widget using a JavaScript action with `window.reactFlowFocus('NodeId')`.

Note: It is an expression, not an attribute. It will NOT get updated with the current selection.

**Customization**
- Dynamic Class: set a CSS class relative to each node. Useful for making a node a certain color based on its data.
- Focus Override: (Optional) the Node ID to focus. When the value changes, the widget will search for and focus on that node. This can be used to focus a node by default.
- Allow dragging: a boolean expression that determines if each node is draggable.

### Edges
![edges](https://github.com/bsgriggs/mendix-react-flow/blob/media/edges.png)  
**Data**  
Data that defines which nodes connect to which other nodes and HOW they connect.  
The Source and Target IDs MUST match an existing Node's ID.  
The 'Line Side' properties define where the line is drawn on each node. For example, below the Source 'Step 1' has Line Side 'Right' and Target 'Step 1b' has Line Side 'Left'.  
![demo_ArrowTypeLine](https://github.com/bsgriggs/mendix-react-flow/blob/media/demo_ArrowTypeLine.png)  

**Customization**  
- Dynamic Class: set a CSS class relative to each edge. Useful for making an edge a certain color based on its data.
- Arrow Type: Either 'Solid' or 'Line'. Recommend creating an enumeration with these values to make it easier to manage in Studio Pro.

| Solid | Line |  
| ------------- | ------------- |  
| ![demo_ArrowTypeSolid](https://github.com/bsgriggs/mendix-react-flow/blob/media/demo_ArrowTypeSolid.png)  | ![demo_ArrowTypeLine](https://github.com/bsgriggs/mendix-react-flow/blob/media/demo_ArrowTypeLine.png)  |  
- Line Type: Either 'Solid' or 'Dotted'. 'Dotted' animates the dots in the direction of the arrow. Recommend creating an enumeration with these values to make it easier to manage in Studio Pro.  
- Curve Type: Either 'bezier', 'step', 'smoothstep', or 'straight'.  Recommend creating an enumeration with these values to make it easier to manage in Studio Pro.  
![demo_CurveTypes](https://github.com/bsgriggs/mendix-react-flow/blob/media/demo_CurveTypes.png)  

_Note: the thickness of the lines and arrows can be customized with CSS on `.mendix-react-flow path.react-flow__edge-path`_

### Customization
![generalStyling](https://github.com/bsgriggs/mendix-react-flow/blob/media/customization.png)  
**Container Size**  
The React Flow library requires the container to have a predefined size. Set the width and height as a string of CSS distances.  

**Zoom**  
Either have the widget zoom to a specific scale on load or attempt to show the full render. The Navigation Zoom is the zoom after the user clicks on the node arrow buttons. *Note: if `Nodes -> Customization -> Focus Override` is set when the widget loads, the widget will use the focus zoom instead.*  
  
Note: the default zoom is to the point (400, 0), which _should_ make (0,0) in the center-top of the display.

**Background**  
Control what type of background, the gap, and how big each type is.  

### Events
![events](https://github.com/bsgriggs/mendix-react-flow/blob/media/events.png)  
Optional events for when the user clicks a node or clicks an edge. The events will pass the exact object from either the Node or Edge data source.  

The On Drag event will be expanded in the **future** to include the X and Y position of where the node ended up, so they can be set back to the Node entity. This is a new feature only available in [10.15+](https://docs.mendix.com/apidocs-mxsdk/apidocs/pluggable-widgets-property-types/#studio-pro-ui-10)


### Accessibility
![accessibility](https://github.com/bsgriggs/mendix-react-flow/blob/media/accessibility.png)  
Aria labels for each node and edge. These are optional.

### Common
![common](https://github.com/bsgriggs/mendix-react-flow/blob/media/common.png)  
General widget Name and Visibility settings. Tab Index is unused.

## Demo project
https://widgettesting105-sandbox.mxapps.io/p/react-flow

## Issues, suggestions, and feature requests
https://github.com/bsgriggs/mendix-react-flow/issues 

## Development and contribution

1. Install NPM package dependencies by using: `npm install`. If you use NPM v10.x.x, which can be checked by executing
   `npm -v`, execute: `npm install --legacy-peer-deps`.
1. Run `npm run dev` to watch for code changes. On every change:
    - the widget will be bundled;
    - the bundle will be included in a `dist` folder in the root directory of the project;
    - the bundle will be included in the `deployment` and `widgets` folder of the Mendix test project.

Benjamin Griggs

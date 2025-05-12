## React Flow for Mendix
Implementation of the [React Flow library](https://reactflow.dev/) for Mendix

## Features
- Display linked data with dynamic content
- The selected node can be shown in a Data View using the 'List to Widget' option
- Events for clicking a specific node or edge
- Ability to focus a specific node from outside the widget
- Provides an area to display custom loading content, like a [spinner](https://marketplace.mendix.com/link/component/204096)

## Limitations
- The widget only handles the rendering of nodes. The developer must write their own logic to position the nodes.
- Dragging nodes is allowed, but the new positions cannot be saved.

## Future Enhancements
- Provide more control over which side of a node the edges connect to

## Data Structures

## Usage

### Nodes
![nodes](https://github.com/bsgriggs/mendix-react-flow/blob/media/nodes.png)  
The Nodes List can be any object. This object will be used to evaluate ALL the other expressions on this tab.  
_Note: The Node ID MUST BE UNIQUE across all nodes._  

**Positions**  
The recommendation is to have the Node objects store a simple coordinate system and then apply scaling in the widget. This makes it easier to manage the positions, and adjustments to the scale can be done all in one place. For example, the nodes could have positions (0,0) (0,1) (1,2) and scaling (400, 175), resulting in the final positions (0,0) (0, 175) and (400, 350).  

**Focus override**  
This setting allows control of the focused node outside the widget. The widget only watches for when the value changes and then tries to find the matching node by its ID.

Note: It is an expression, not an attribute. It will NOT get updated with the current selection.

### Edges
![edges](https://github.com/bsgriggs/mendix-react-flow/blob/media/edges.png)  
Data that defines which nodes connect to which other nodes and HOW they connect.  
The Source and Target IDs MUST match an existing Node's ID.  

**Line Type** - String expression that MUST be either "Solid" or "Dotted"


### General Styling
![generalStyling](https://github.com/bsgriggs/mendix-react-flow/blob/media/generalStyling.png)  
**Container Size** - The React Flow library requires the container to have a pre-defined size. Set the width and height as a string of CSS distances.  
**Zoom** - Either have the widget zoom to a specific scale on load or attempt to show the full render. The Navigation Zoom is the zoom after the user clicks on the node arrow buttons. *Note: if the focus override is set when the widget loads, the widget will use the focus zoom instead.*  
  
Note: the default zoom is to the point (400, 0) which should make (0,0) in the center-top of the display.

### Events
![events](https://github.com/bsgriggs/mendix-react-flow/blob/media/events.png)  
Optional events for when the user clicks a node or clicks an edge. The events will pass the exact object from either the Node or Edge data source.

## Demo project
[link to sandbox]

## Issues, suggestions and feature requests
https://github.com/bsgriggs/mendix-react-flow/issues 

## Development and contribution

1. Install NPM package dependencies by using: `npm install`. If you use NPM v10.x.x, which can be checked by executing
   `npm -v`, execute: `npm install --legacy-peer-deps`.
1. Run `npm run dev` to watch for code changes. On every change:
    - the widget will be bundled;
    - the bundle will be included in a `dist` folder in the root directory of the project;
    - the bundle will be included in the `deployment` and `widgets` folder of the Mendix test project.

Benjamin Griggs

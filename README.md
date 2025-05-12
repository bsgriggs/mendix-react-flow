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

## Data Structures
## Usage
### Nodes
### Edges
### General Styling
### Events

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

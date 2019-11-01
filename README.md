# COSMOS Web

COSMOS Web - a web application to visualize telemetry data from a satellite. UI Repository.

See https://github.com/spjy/cosmos-mongodb for the server component of COSMOS Web.

## Requirements

1. Node.js
2. NPM

## Installing

Open a terminal and change directories to the location you want to install the repository.

```
git clone https://github.com/spjy/cosmos-web.git
cd cosmos-web
npm install
```

If you need to modify the default environment variable values (do not modify .env.defaults directly):

```
cp .env.defaults .env
```

```
WEBSOCKET_IP=localhost # Agent Mongo IP
QUERY_WEBSOCKET_PORT=8080 # Port of the WS to access the query endpoints
LIVE_WEBSOCKET_PORT=8081 # Port of the WS to access the live endpoints
CESIUM_ION_TOKEN= # Token for the globe simulation (optional)
```

If you need to run Agent Mongo, the server component of COSMOS Web, see this repository: https://github.com/spjy/cosmos-mongodb
If you need to run Agent Socket, which is Agent Mongo without the database component, see this repository: https://github.com/spjy/cosmos-socket

## Running

```
npm start
```

## Docker Development Image

If you want to run the COSMOS Web development image through Docker:

```
docker build . -t cosmos_web
docker run 3000:3000 cosmos_web
```
## Standards

### Filesystem

**File Naming Standards**

All files should be in upper camel case format. If it contains JSX within the file, the extension shall be `.jsx`.

**JSX File Standards**

All JSX files shall follow the React Hooks API standard. This means all components should follow the functional style component creation.

If a component requires a prop function to be passed (e.g. onChange), it should be abstracted out, meaning it should have its own function definition. If it is only changing the state and/or calling another function, you may use just an inline function. Function names should be in lower camel case.

The React component along with all React states, functions and props should be documented using the [React Styleguidist](https://react-styleguidist.js.org/docs/documenting.html) standard.

For use of a global state (to allow components to share the same state where the React state becomes difficult to manage), the React Context API should be used in conjunction with reducers (if needed).

**Folder Organization**

`/src/components`

This folder contains each page's components, and each page's corresponding components should be in a folder with the same name as the page.

Exception: Components that are reusable and can span across different pages are to be put into the `Global` folder.

`/src/pages`

This folder contains a different route to a page. Each page should contain only layout logic and store logic if children components require it.

`/src/store`

This folder contains the React Context global store and reducer logic.

### Commit Style

Follow the [AngularJS commit style](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines).


# Developer Configurations

## Configuring Routes

You can configure the routes through `/src/routes/index.js`. Each top level object within the routes array corresponds to a page.

Each object has a `name`, `icon`, `component`, `path` and `props`. 

Name is the name that will show up on the navigation bar, the icon is the icon that will show up on the navigation bar, and the component is the component that will be shown on the route. 

The path is the route that corresponds to the page. You can add `/:id` at the end to specify that it is layout enabled. Props are optional; within the props object, you can provide the default layout of the page.

For the path

For example:

```javascript
const routes = [
  {
    name: 'Satellites',
    icon: 'rocket',
    path: '/satellite/:id',
    component: Dashboard,
    props: {
      defaultLayout: {
        lg: [
          {
            i: 'satellite-default-f',
            x: 6,
            y: 2,
            w: 6,
            h: 21,
            component: {
              name: 'Attitude',
              props: {
                attitudes: [
                  {
                    name: 'n1',
                    nodeProcess: 'cubesat1:propagator_simple',
                    quaternions: {
                      d: {
                        x: 0,
                        y: 0,
                        z: 0,
                      },
                      w: 0,
                    },
                    live: true,
                  },
                ],
              },
            },
          },
        ]
      }
    }
  }
]
```

## General Components

### AsyncComponent.jsx

AsyncComponent is the component that brings together dashboard components. It allows the dashboard components to be rendered via the `routes.js` file by name.

### BaseComponent.jsx 

BaseComponent is the component that contains common functionality and user interfaces across other components. For instance, it contains a header, configuration form modal, and content area for other componenents.

### ComponentSettings.jsx

ComponentSettings contains the configuration form modal used in BaseComponent.

### LayoutManager.jsx

LayoutManager is page that allows users to create layouts and add them to pages.

### LayoutSelector.jsx

LayoutSelector is the dropdown menu located at the top of layout enabled pages, and it allows selection of a certain layout for a certain page. 

# Application Usage

## Home Page

The splash page with a little bit of information.

## Dashboard Manager

The page to manage saved page layouts for routes such as satellites or ground stations.

### Modifying a Pre-existing Layout

On this page, there is a table to view the currently saved layouts on the computer. Modify it by clicking the `+` on the left or delete it using the `X` on the right.

### Creating a New Layout

To create a new layout, use the form below and fill out:

#### Route

The routes that are able to have saved layouts. For instance, you can select the layout to be saved under 'Ground Stations' or 'Satellites'.

#### Dashboard Name

The name of the layout for a certain route. Differentiate between other layout names.

#### Layout Array

*Sizing*. Each row has a width (w) of twelve (12).

*Formatting*. You must enter an array of objects. Each object contains a unique:

- Unique key (i) - to avoid conflicts with other layouts,  use the format: dashboardName-key
- Width (w)
- Height (h)
- Horiztonal position (w)
- Vertical position (y)
- Component name (component.name)
- Component props (component.props)

*Example*.
```json
[
  {
    "i": "dashboardName-a",
    "x": 0,
    "y": 0,
    "w": 6,
    "h": 7,
    "component": {
      "name": "Status",
      "props": {
        "name": "Ok"
      }
    }
  },
    {
    "i": "dashboardName-b",
    "x": 6,
    "y": 0,
    "w": 6,
    "h": 7,
    "component": {
      "name": "DisplayValues",
      "props": [
        {
          "name": "CPU Load",
          "nodeProcess": "beagle1:cpu",
          "dataKey": "device_cpu_load_000",
          "unit": "%",
        }
      ]
    }
  },
]
```

*Component Name and Props*: For a list of components that are available to be used and each component's props, see [components.md](https://github.com/spjy/cosmos-web/blob/master/components.md).

Click *Preview* to see the layout.

Click *Save Layout* to save it.

### Switching Layouts

On top of each Dashboard page, e.g. Sattelites or Ground Stations, a dropdown menu coupled with a button exist to allow for quickly switching between pre-defined layouts.

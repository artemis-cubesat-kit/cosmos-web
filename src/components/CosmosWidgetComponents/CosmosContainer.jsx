import React, { Component } from 'react';
import { Card } from 'antd';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import CosmosAgent from './CosmosAgent';
import { parseLiveData } from '../Cosmos/CosmosPlotLibs';
import cosmosInfo from '../Cosmos/CosmosInfo';

const socket = io(cosmosInfo.socket);


/* This component renders the entire 'Cosmos Tools'page including widgets
 - this component monitors COSMOS Agent data, and passes relevant data to each widget
  (does not store history, only one at a time )
*/


class CosmosContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      agents: {},
      widgets: []
    };
  }

  componentDidMount() {
    // instantiate all agents, start listening for data
    const { widgets } = this.props;
    const agents = {};
    for (let i = 0; i < widgets.length; i += 1) {
      if ('agent' in widgets[i] && widgets[i].agent !== '') {
        const agentName = widgets[i].agent;
        if (agents[agentName]) { // add json names to track
          if (widgets[i].data_name) {
            widgets[i].values = this.state.agents[agentName].info
              .getDataStructure(widgets[i].data_name);
            this.startListening(agentName);
          }
        } else {
          agents[agentName] = { info: new CosmosAgent({ agent: agentName }), data: {} };
          agents[agentName].info.asyncSetup()
            .then(() => {
              if (widgets[i].data_name) {
                widgets[i].values = agents[agentName].info.getDataStructure(widgets[i].data_name);
                this.startListening(agentName);
              }
            });
        }
      }
    }
    this.setState({ agents, widgets });
  }

  componentWillUnmount() {
    // remove listeners
    const agents = Object.keys(this.state.agents);
    for (let i = 0; i < agents.length; i += 1) {
      socket.removeAllListeners(`agent subscribe ${agents[i]}`);
      socket.emit('end record', agents[i]);
    }
  }


  removeWidget = (index) => {
    // function passed to widgets to delete a widget
    const { widgets } = this.state;
    widgets.splice(index.id, 1);
    this.setState({ widgets });
  }

  updateWidget = (index, info) => {
    const { widgets } = this.state;
    // update agent values that need to be tracked
    const changes = Object.keys(info);
    let key;
    for (let i = 0; i < changes.length; i += 1) {
      key = changes[i];
      widgets[index][key] = info[key];
    }
    this.setState({ widgets });
  }

  startListening(agentname) {
    socket.emit('start record', agentname);
    socket.on(`agent subscribe ${agentname}`, (data) => { // subscribe to agent
      if (data) {
        let e;
        const { agents } = this.state;
        if (agents[agentname].info.values.label.length > 0) {
          e = parseLiveData(data, agents[agentname].info.values);
          agents[agentname].data = e;
          this.setState({ agents });
        }
      }
    });
  }

  agentStructure(agentName) {
    const { agents } = this.state;
    if (agents[agentName]) {
      return agents[agentName].info.structure;
    }
    return [];
  }

  render() {
    const widgets = [];
    let widgetData = {};
    let WidgetComponent;
    let widgetType;
    for (let i = 0; i < this.state.widgets.length; i += 1) {
      if (this.state.agents[this.state.widgets[i].agent]
        && this.state.widgets[i].data_name) {
        widgetData = this.state.agents[this.state.widgets[i].agent].data;
      }
      widgetType = this.state.widgets[i].widgetClass;
      WidgetComponent = this.props.imports[widgetType];
      if (WidgetComponent) {
        widgets.push(
          <WidgetComponent
            key={i}
            id={i}
            info={this.state.widgets[i]}
            data={widgetData}
            mod={this.props.mod}
            selfDestruct={this.removeWidget}
            updateInfo={this.updateWidget}
          />
        );
      }
    }
    return (
      <div>
        <Card size="small" style={{ margin: '10px' }}>
          {widgets}
        </Card>
      </div>
    );
  }
}


CosmosContainer.propTypes = {
  widgets: PropTypes.arrayOf(PropTypes.object).isRequired,
  imports: PropTypes.shape({}),
  mod: PropTypes.bool // true: widgets can be modified
};

CosmosContainer.defaultProps = {
  imports: {},
  mod: true
};
export default CosmosContainer;

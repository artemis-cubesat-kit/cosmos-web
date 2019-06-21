/* global fetch:false */
import React, { Component } from 'react';
import { Table, Badge } from 'antd';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

import cosmosInfo from '../Cosmos/CosmosInfo';
import CosmosWidget from '../CosmosWidgetComponents/CosmosWidget';

const socket = io(cosmosInfo.socket);

const columns = [{
  title: 'Agent',
  dataIndex: 'agent_proc',
  key: 'agent_proc',
  width: '16%'
}, {
  title: 'Node',
  dataIndex: 'agent_node',
  key: 'agent_node',
  width: '16%'
}, {
  title: 'Address',
  dataIndex: 'agent_addr',
  key: 'agent_addr',
  width: '16%'
}, {
  title: 'Port',
  dataIndex: 'agent_port',
  key: 'agent_port',
  width: '16%'
}, {
  title: 'UTC',
  dataIndex: 'agent_utc',
  key: 'agent_utc',
  width: '16%'
}, {
  title: 'AgentStatus',
  dataIndex: 'status',
  key: 'status',
  width: '16%'
}];

class AgentList extends Component {
/* Returns a table element of all agents, which gets updated every five seconds */
  constructor() {
    super();

    this.state = {
      agents: []
    };
  }

  componentDidMount() {
    fetch(`${cosmosInfo.socket}/api/agent_list`)
      .then(response => response.json())
      .then((data) => {
        this.setState({
          agents: data.result
        });
      });

    socket.on('agent update list', (data) => { // subscribe to agent
      if (data) {
        const { agents } = this.state;

        agents.forEach((agent, i) => {
          if (data[agents[i].agent_proc]) {
            // console.log( agents[i].agent_proc," live")
            agents[i].live = true;
          } else {
            agents[i].live = false;
          }
        });

        this.setState({ agents });
      }
    });
  }

  componentWillUnmount() {
    socket.removeAllListeners('agent update list');
  }

  render() {
    const { agents } = this.state;
    // var keys = Object.keys(agent_list);
    const data = [];

    agents.forEach((agent, i) => {
      let status = <Badge status="default" />;

      if (agent.live === true) {
        status = <Badge status="success" />;
      }

      data[i] = {
        key: String(i),
        agent_proc: String(agent.agent_proc),
        agent_node: agent.agent_node,
        agent_addr: agent.agent_addr,
        agent_port: agent.agent_port,
        agent_utc: agent.agent_utc,
        status
      };
    });

    return (
      <CosmosWidget
        id={this.props.id}
        title="Agents"
        mod={false}
        selfDestruct={this.props.selfDestruct}
      >
        <Table
          columns={columns}
          dataSource={data}
          size="small"
          pagination={false}
        />
      </CosmosWidget>
    );
  }
}

AgentList.propTypes = {
  id: PropTypes.number.isRequired,
  selfDestruct: PropTypes.func.isRequired
};

export default AgentList;
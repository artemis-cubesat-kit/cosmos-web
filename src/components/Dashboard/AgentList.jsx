import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import BaseComponent from '../BaseComponent';
import AgentListTable from './AgentList/AgentListTable';

/**
 * Retrieves the agent list and displays it in a table.
 * Also displays the timestamp of the agent's last heartbeat.
 */
function AgentList({
  node,
  height,
}) {
  /** Get agent list state from the Context */
  const list = useSelector((s) => s.list.agent_list);
  const [agentList, setAgentList] = useState([]);

  useEffect(() => {
    setAgentList([]);
    if (node !== '' && list != null) {
      setAgentList(list.filter((item) => item.agent.split(':')[0] === node));
    } else if (list != null) {
      setAgentList(list);
    }
  }, [list]);

  return (
    <BaseComponent
      name="Agent List"
      movable
      height={height}
    >
      <AgentListTable
        list={agentList || []}
        node={node}
      />
    </BaseComponent>
  );
}

AgentList.propTypes = {
  node: PropTypes.string,
  height: PropTypes.number.isRequired,
};

AgentList.defaultProps = {
  node: '',
};

export default AgentList;

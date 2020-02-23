import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import {
  Button, Popover, Icon, message,
} from 'antd';

import BaseComponent from '../BaseComponent';
import socket from '../../socket';

/**
 * Component to handle pre-defined sequences of commands to run agent commands.
 */
function Sequence({
  sequences,
}) {
  /** Auto scroll the history log to the bottom */
  const [updateLog, setUpdateLog] = useState(false);
  /** Agent command history (to display in the terminal) */
  const [commandHistory, setCommandHistory] = useState([]);

  /** DOM Element selector for history log */
  const cliEl = useRef(null);

  const execute = async (sequence) => {
    message.loading('Starting sequence...', 0);

    /** Listen for command outputs and append them to the command history.
     * Force scroll to the bottom.
     */
    await Promise.all(sequence.map(async (command) => {
      const ws = socket('query', '/command/');

      await new Promise((resolve) => {
        ws.onopen = () => {
          ws.send(`${process.env.COSMOS_BIN}/agent ${command}`);

          ws.onmessage = ({ data }) => {
            commandHistory.push(`➜ agent ${command}`);

            setUpdateLog(true);

            commandHistory.push(data);

            setUpdateLog(true);

            resolve();
            ws.close();
          };

          ws.onclose = () => {
          };
        };
      });
    }));

    message.destroy();

    commandHistory.push('--- End of sequence. ---');

    setUpdateLog(true);

    message.success('Finished sequence.', 5);
  };

  useEffect(() => {
    cliEl.current.scrollTop = cliEl.current.scrollHeight;
    setUpdateLog(null);
  }, [updateLog]);

  return (
    <BaseComponent
      name="Sequence"
    >
      <div className="flex">
        {
          sequences.map(sequence => (
            <div
              className="m-1"
              key={sequence.button}
            >
              <Button.Group>
                <Button
                  onClick={() => {
                    execute(sequence.sequence);
                  }}
                >
                  {sequence.button}
                </Button>
                <Popover
                  content={(
                    <div className="font-mono">
                      {
                        sequence.sequence.map(s => (
                          <div>
                            ➜ agent&nbsp;
                            {s}
                          </div>
                        ))
                      }
                    </div>
                  )}
                  title="Sequence"
                  trigger="click"
                  placement="topLeft"
                >
                  <Button>
                    <Icon type="question" />
                  </Button>
                </Popover>
              </Button.Group>
            </div>
          ))
        }
      </div>
      <div
        className="m-1 border border-gray-300 rounded mb-2 p-4 bg-white font-mono h-32 max-h-full resize-y overflow-y-auto mt-2"
        ref={cliEl}
      >
        {
          // eslint-disable-next-line
          commandHistory.map((command, i) => (<div key={i}>{ command }</div>))
        }
      </div>
    </BaseComponent>
  );
}

Sequence.propTypes = {
  sequences: PropTypes.arrayOf(
    PropTypes.shape({
      button: PropTypes.string,
      sequence: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
};

Sequence.defaultProps = {
  sequences: [],
};

export default Sequence;

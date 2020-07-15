import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Badge, Switch } from 'antd';
import dayjs from 'dayjs';

import BaseComponent from '../BaseComponent';

/**
 * Retrieves data from a web socket. Displays an event along with the timestamp in a table.
 */
function Activity({
  height,
}) {
  /** Get agent list state from the Context */
  const activities = useSelector((s) => s.activity);

  const [color, setColor] = useState('red');
  const [toggle, setToggle] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(null);
  const [data, setData] = useState([]);

  const timerYellow = useRef(null);
  const timerRed = useRef(null);
  const timer = useRef(null);

  // Get lastDate (last retrieved date) and compare with current time)
  // Compare. If <2 min, green, <5min, yellow, < 10min, red

  const getDiff = (date) => {
    if (dayjs().diff(date, 'day') < 1) {
      const hour = dayjs().hour() - date.hour();
      const minute = dayjs().minute() - date.minute();
      const second = dayjs().second() - date.second();
      return dayjs().set('hour', hour).set('minute', minute).set('second', second);
    }
    return 0;
  };

  useEffect(() => {
    if (activities && activities.length !== 0) {
      setData([
        {
          status: activities[0].status,
          summary: activities[0].summary,
          scope: activities[0].scope,
          time: activities[0].time,
          elapsed: getDiff(activities[0].time),
        },
        ...data,
      ]);

      const minuteDifference = activities[0].time.diff(dayjs(), 'minute');
      if (-minuteDifference <= 2) {
        setElapsedTime(getDiff(activities[0].time));

        if (timer.current != null) {
          clearTimeout(timer.current);
        }

        setColor('green');

        if (timerYellow.current != null && timerRed.current != null) {
          clearTimeout(timerYellow.current);
          clearTimeout(timerRed.current);
        }

        timerYellow.current = setTimeout(() => {
          setColor('orange');
        }, 300000);
        timerRed.current = setTimeout(() => {
          setColor('red');
        }, 600000);
      }
    }
  }, [activities]);

  useEffect(() => {
    if (elapsedTime != null) {
      timer.current = setTimeout(() => {
        setElapsedTime(elapsedTime.add(1, 'second'));
        setData(data.map((point) => ({
          status: point.status,
          summary: point.summary,
          scope: point.scope,
          time: point.time,
          elapsed: typeof point.elapsed === 'string'
            || point.elapsed.add(1, 'second').hour() === 24
            ? 'more than a day ago' : point.elapsed.add(1, 'second'),
        })));
      }, 1000);
    }

    return () => clearTimeout(timer.current);
  }, [elapsedTime]);

  return (
    <BaseComponent
      name="Activity"
      liveOnly
      toolsSlot={(
        <>
          <span className="mr-3">
            <Badge status="success" />
            {'< 5 min'}
          </span>
          <span className="mr-3">
            <Badge status="warning" />
            {'< 10 min'}
          </span>
          <span className="mr-3">
            <Badge status="error" />
            {'> 10 min'}
          </span>
          <Switch
            checked={toggle}
            onClick={() => setToggle(!toggle)}
            checkedChildren="Visible"
            unCheckedChildren="Invisible"
          />
        </>
      )}
      height={height}
    >
      <style jsx>
        {
          `
            .activity {
              min-height: 350px;
            }
          `
        }
      </style>
      <div className={`bg-${color}-200 transition ease-in duration-500 rounded p-3 activity overflow-auto`}>
        {toggle ? (
          <>
            <div className="text-center text-2xl">
              {
                elapsedTime && elapsedTime.hour() < 24
                  ? elapsedTime.format('HH:mm:ss') : 'Time elapsed >24 hours!'
              }
            </div>
            <table>
              <tbody>
                {
                // eslint-disable-next-line camelcase
                data ? data.map(({
                  status, summary, scope, time, elapsed,
                }) => (
                  // eslint-disable-next-line camelcase
                  <tr className="truncate ..." key={summary + time + scope}>
                    <td>
                      <Badge status={status} />
                    </td>
                    <td className="pr-4 text-gray-600">
                      {
                        time.utc().format('HH:mm:ss')
                      }
                    </td>
                    <td>
                      {summary}
                        &nbsp;
                      <span className="text-gray-600">
                        {scope}
                      </span>
                    </td>
                    <td>
                      {
                        elapsed
                      }
                    </td>
                  </tr>
                )) : 'No activity.'
              }
              </tbody>
            </table>
          </>
        )
          : (
            <div className="mt-10 text-center text-5xl">
              {
                elapsedTime && elapsedTime.hour() < 24
                  ? elapsedTime.format('HH:mm:ss') : 'Time elapsed >24 hours!'
              }
            </div>
          )}
      </div>
    </BaseComponent>
  );
}

Activity.propTypes = {
  height: PropTypes.number.isRequired,
};

export default Activity;

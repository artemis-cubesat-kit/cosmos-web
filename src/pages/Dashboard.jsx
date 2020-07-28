import React, {
  useState, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  message,
  Drawer,
  Form,
  Input,
  Modal,
  Tabs,
  Divider,
  Space,
  Slider,
  Col,
  Row,
  InputNumber,
  Menu,
  Badge,
} from 'antd';
import { Responsive, WidthProvider } from 'react-grid-layout';
import {
  CloseOutlined,
  EditOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';

import { axios, socket } from '../api';
import routes from '../routes';
import defaultComponent from '../components/Default/Default';
import { set, setData, setActivity } from '../store/actions';
import { dateToMJD } from '../utility/time';

import AsyncComponent, { components } from '../components/AsyncComponent';
import LayoutSelector from '../components/LayoutSelector';
import Clock from '../components/Statuses';
import SocketStatus from '../components/SocketStatus';
import FlightStatus from '../components/FlightStatus';
import GetHistoricalData from '../components/GetHistoricalData';

const { TabPane } = Tabs;

const ResponsiveGridLayout = WidthProvider(Responsive);

const breakpoints = {
  lg: 996,
};

const cols = {
  lg: 12,
};

const margin = [12, 12];

function Dashboard({
  id,
  defaultLayout,
  path,
  realms,
}) {
  const dispatch = useDispatch();
  const activities = useSelector((s) => s.activity);
  const tabsStatus = useSelector((s) => s.tabStatus);

  /** Store the default page layout in case user wants to switch to it */
  const [defaultPageLayout, setDefaultPageLayout] = useState({
    lg: [],
  });

  /** List of tabs on the page */
  const [tabs, setTabs] = useState({
    lg: [],
  });

  /** Currently selected layout in use */
  const [layouts, setLayouts] = useState({
    lg: [],
  });

  /** Control the visibility of the layout editor on dashboard */
  const [visible, setVisible] = useState(false);
  /** Track mouse movements */
  // const [mouseY, setMouseY] = useState(null);
  /** Variable for the height of the drawer */
  const [height/* , setHeight */] = useState(400);
  /** Original mouse position */
  // const [origMouseY, setOrigMouseY] = useState(null);

  /** State for editing JSON of the layout */
  const [jsonEdit, setJsonEdit] = useState('');

  /** String for the component editor */
  const [componentEditor, setComponentEditor] = useState(JSON.stringify({
    i: 'Will be randomly generated',
    x: 0,
    y: 0,
    w: 4,
    h: 7,
    component: {},
  }, null, 2));

  const [dimensions, setDimensions] = useState([4, 7]);

  /** Control visibility of the save layout form */
  const [formVisible, setFormVisible] = useState(false);
  /** Form for saving layout */
  const [formSave] = Form.useForm();
  /** Error from the form */
  const [formError, setFormError] = useState('');
  /** Update the dropdown to select layouts */
  const [updateLayoutSelector, setUpdateLayoutSelector] = useState(false);

  const [socketStatus, setSocketStatus] = useState('error');

  /** Get socket data from the agent */
  useEffect(() => {
    const live = socket('/live/all');

    // Set current realm
    dispatch(set('realm', id));
    const flightMode = process.env.FLIGHT_MODE;

    /** Get latest data from neutron1_exec */
    live.onmessage = ({ data }) => {
      try {
        const json = JSON.parse(data);
        const [node, process] = json.node_type.split(':');

        if (json.node_type === 'list') {
          dispatch(set('list', json));
        // Send data if allowed node AND if flight mode and soh, send,
        // OW if not flight mode don't send soh
        } else if (realms[id].includes(node) && ((flightMode === 'true') || (!(flightMode === 'true') && process !== 'soh'))) {
          dispatch(set('lastDate', dayjs()));

          const aliases = {
            device_bcreg_power_000: json.device_bcreg_volt_000 && json.device_bcreg_amp_000
              ? json.device_bcreg_volt_000 * json.device_bcreg_amp_000 : undefined,
            device_bcreg_power_001: json.device_bcreg_volt_001 && json.device_bcreg_amp_001
              ? json.device_bcreg_volt_001 * json.device_bcreg_amp_001 : undefined,
            device_bcreg_power_002: json.device_bcreg_volt_002 && json.device_bcreg_amp_002
              ? json.device_bcreg_volt_002 * json.device_bcreg_amp_002 : undefined,
            device_bcreg_power_003: json.device_bcreg_volt_003 && json.device_bcreg_amp_003
              ? json.device_bcreg_volt_003 * json.device_bcreg_amp_003 : undefined,
            device_bcreg_power_004: json.device_bcreg_volt_004 && json.device_bcreg_amp_004
              ? json.device_bcreg_volt_004 * json.device_bcreg_amp_004 : undefined,
            device_bcreg_power_005: json.device_bcreg_volt_005 && json.device_bcreg_amp_005
              ? json.device_bcreg_volt_005 * json.device_bcreg_amp_005 : undefined,
            device_swch_power_000: json.device_swch_volt_000 && json.device_swch_amp_000
              ? json.device_swch_volt_000 * json.device_swch_amp_000 : undefined,
            device_swch_power_001: json.device_swch_volt_001 && json.device_swch_amp_001
              ? json.device_swch_volt_001 * json.device_swch_amp_001 : undefined,
            device_swch_power_002: json.device_swch_volt_002 && json.device_swch_amp_002
              ? json.device_swch_volt_002 * json.device_swch_amp_002 : undefined,
            device_swch_power_003: json.device_swch_volt_003 && json.device_swch_amp_003
              ? json.device_swch_volt_003 * json.device_swch_amp_003 : undefined,
            device_swch_power_004: json.device_swch_volt_004 && json.device_swch_amp_004
              ? json.device_swch_volt_004 * json.device_swch_amp_004 : undefined,
            device_swch_power_005: json.device_swch_volt_005 && json.device_swch_amp_005
              ? json.device_swch_volt_005 * json.device_swch_amp_005 : undefined,
            device_swch_power_006: json.device_swch_volt_006 && json.device_swch_amp_006
              ? json.device_swch_volt_006 * json.device_swch_amp_006 : undefined,
            device_swch_power_007: json.device_swch_volt_007 && json.device_swch_amp_007
              ? json.device_swch_volt_007 * json.device_swch_amp_007 : undefined,
            device_swch_power_008: json.device_swch_volt_008 && json.device_swch_amp_008
              ? json.device_swch_volt_008 * json.device_swch_amp_008 : undefined,
            device_swch_power_009: json.device_swch_volt_009 && json.device_swch_amp_009
              ? json.device_swch_volt_009 * json.device_swch_amp_009 : undefined,
            recorded_time: dateToMJD(dayjs().utc()),
          };

          // Store in realm object
          dispatch(setData(id, {
            ...json,
            ...aliases,
          }));

          dispatch(setActivity({
            status: 'success',
            summary: 'Data received',
            scope: `from ${json.node_type}`,
          }));
        }
      } catch (error) {
        message.error(error.message);
      }
    };

    /** Update statuses on error/connection */
    live.onclose = () => {
      setSocketStatus('error');
    };

    live.onerror = () => {
      setSocketStatus('error');
    };

    live.onopen = () => {
      setSocketStatus('success');
    };

    return () => {
      live.close(1000);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function fetchNamespace() {
      try {
        const agents = await axios.get('/namespace/all');

        dispatch(set('namespace', agents.data));
      } catch (error) {
        message.error(error.message);
      }
    }

    fetchNamespace();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Retrieve default layout for page */
  useEffect(() => {
    // By default, set the defaultLayout prop as a flive.ack if child doesn't have a layout set
    let layout = defaultLayout;
    let dataKeys = [];
    const tabStatus = [];

    // Find child route of dashboard and retrieve default layout
    routes.forEach((route) => {
      if (route.path === path && route.children) {
        route.children.forEach((child) => {
          // Get page layout from route config and save it into the state
          if (child.name === id && child.defaultLayout) {
            child.defaultLayout.lg.forEach((component) => {
              if (component.component.name === 'DisplayValue') {
                component.component.props.displayValues.forEach(
                  ({ dataKey, dataKeyUpperThreshold, dataKeyLowerThreshold }) => {
                    if (dataKeyUpperThreshold || dataKeyLowerThreshold) {
                      dataKeys.push({
                        [dataKey]: {
                          dataKeyUpperThreshold,
                          dataKeyLowerThreshold,
                        },
                      });
                    }
                  },
                );
              }
            });
            tabStatus.push({
              defaultLayout: {
                dataKeys,
                status: 'success',
              },
            });
            layout = child.defaultLayout;
            setDefaultPageLayout(child.defaultLayout);
          }

          // Get page layout simple from route config and save it into the state
          if (child.name === id && child.tabs) {
            Object.keys(child.tabs).forEach((tab) => {
              dataKeys = [];
              child.tabs[tab].lg.forEach((component) => {
                if (component.component.name === 'DisplayValue') {
                  component.component.props.displayValues.forEach(
                    ({ dataKey, dataKeyUpperThreshold, dataKeyLowerThreshold }) => {
                      if (dataKeyUpperThreshold || dataKeyLowerThreshold) {
                        dataKeys.push({
                          [dataKey]: {
                            dataKeyUpperThreshold,
                            dataKeyLowerThreshold,
                          },
                        });
                      }
                    },
                  );
                }
              });
              tabStatus.push({
                [tab]: {
                  dataKeys,
                  status: 'success',
                },
              });
            });

            setTabs(child.tabs);
          }
        });
      }
    });

    dispatch(set('tabStatus', tabStatus));
    // Set timeout to let the grid initialize; won't work otherwise.
    setTimeout(() => {
      setLayouts(layout);

      // Initialize JSON editor
      setJsonEdit(JSON.stringify(layout.lg, null, 2));
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultLayout, id, path]);

  /** Save layout */
  const saveLayout = (dashname) => {
    const route = path.split('/')[1];
    // Store the layout into localStorage
    try {
      try {
        setUpdateLayoutSelector(true);
        // Check if the route already has an object to store the saved layout
        if (!(typeof JSON.parse(localStorage.getItem(route)) === 'object')
          && JSON.parse(localStorage.getItem(route) !== null)
        ) {
          throw new Error(`${route} is not an array.`);
        }
      } catch (error) {
        // If not, set it to an empty object
        localStorage.setItem(route, JSON.stringify({}));
      }

      // Store the layout based on the name given
      localStorage.setItem(route, JSON.stringify({
        ...JSON.parse(localStorage.getItem(route)),
        [dashname]: layouts,
      }));

      setUpdateLayoutSelector(false);
      message.success('Layout saved successfully.', 10);
    } catch {
      message.error('Error saving layout.', 10);
    }
  };

  /**
   * Checks to see if the layout array's objects contain all of the correct keys
   */
  const processLayoutObject = () => {
    try {
      const json = JSON.parse(jsonEdit);

      // Check if pass in an array of objects
      if (!json.length) {
        throw new Error('Outer container must be an array.');
      }

      // Validate the required fields
      json.forEach((component, i) => {
        if (!component
          || !('i' in component)
          || !('x' in component)
          || !('y' in component)
          || !('w' in component)
          || !('h' in component)
          || !('component' in component)
          || !('name' in component.component)
        ) {
          throw new Error(`Object number ${i} object must contain a key (i), width (x), height (y) and component (component.name)`);
        }
      });

      // If all valid, set the layout object
      setLayouts({
        lg: json,
      });

      message.success('Successfully updated layout.');

      // Reset form error message
      setFormError('');
    } catch (error) {
      setFormError(error.message);
    }
  };

  /** Set the layout based on using the LayoutSelector function */
  const selectLayout = (layout) => {
    if (layout === 'defaultRouteLayout') {
      setLayouts(defaultLayout);

      setJsonEdit(JSON.stringify(defaultLayout, null, 2));
    } else if (layout === 'defaultPageLayout') {
      setLayouts(defaultPageLayout);

      setJsonEdit(JSON.stringify(defaultPageLayout, null, 2));
    } else {
      setLayouts(layout);

      setJsonEdit(JSON.stringify(layout, null, 2));
    }

    message.success('Successfully changed layout.');
  };

  /** Remove component while in editor mode */
  const deleteComponent = (e) => {
    try {
      const key = e.currentTarget.getAttribute('layoutkey');
      const newLayout = layouts.lg.filter((el) => el.i !== key);
      setLayouts({
        lg: newLayout,
      });
      message.success('Successfully deleted component.');
    } catch (err) {
      message.error(err);
    }
  };

  /** Add component using JSON layout editor */
  const addToLayout = (elemParams) => {
    try {
      // Convert JSON input to JS
      const add = JSON.parse(componentEditor);

      /** If provided position via dropping */
      if (elemParams) {
        add.x = elemParams.x;
        add.y = elemParams.y;
      }

      let rand;
      let newId;

      /** Generate random id for the component in 'i' field */
      do {
        rand = Math.random()
          .toString(36)
          .substring(7);
        newId = `${path.split('/')[1]}-${id}-${rand}`;
        // eslint-disable-next-line no-loop-func
      } while (layouts.lg.find((object) => object.i === newId) !== undefined);

      // Add to object
      add.i = newId;

      if (add.component.name === 'DisplayValue') {
        add.component.props.displayValues.forEach(
          ({ dataKey, dataKeyUpperThreshold, dataKeyLowerThreshold }) => {
            if (dataKeyUpperThreshold || dataKeyLowerThreshold) {
              // Interact with dispatch
              // dataKeys.push({
              //   [dataKey]: {
              //     dataKeyUpperThreshold,
              //     dataKeyLowerThreshold,
              //   },
              // });
            }
          },
        );
      }

      // Update layout with new component
      setLayouts({
        lg: [
          ...layouts.lg,
          add,
        ],
      });

      message.success('Successfully added component.');
    } catch {
      message.error('Error adding component.');
    }
  };

  const retrieveInfo = (e) => {
    const compName = e.currentTarget.getAttribute('keyid');
    const retrieved = defaultComponent.find((el) => el.name === compName);
    const modify = JSON.parse(componentEditor);

    modify.component.name = retrieved.name;
    modify.component.props = retrieved.props;
    setComponentEditor(JSON.stringify(modify, null, 2));
  };

  /** Change the dimensions of the to-be-added component */
  const changeDimensions = (value, dim) => {
    const change = JSON.parse(componentEditor);

    switch (dim) {
      case 'w':
        setDimensions([value, dimensions[1]]);
        change.w = value;
        break;
      case 'h':
        setDimensions([dimensions[0], value]);
        change.h = value;
        break;
      default:
        break;
    }

    setComponentEditor(JSON.stringify(change, null, 2));
  };

  /* const getMousePosition = (e) => {
    setMouseY(e.clientY);
  };

  useEffect(() => {
    if (origMouseY !== 0 && origMouseY !== null) {
      const calculateHeight = height + (origMouseY - mouseY);
      if (calculateHeight >= 100 && calculateHeight <= 950) {
        setHeight(height + (origMouseY - mouseY));
        setOrigMouseY(mouseY);
      }
    }
  }); */

  /** Check if the component JSON is valid */
  const checkComponentJson = () => {
    try {
      JSON.parse(componentEditor);
      return true;
    } catch {
      return false;
    }
  };

  /** Color of the indicator, initial state is red */
  const [color, setColor] = useState('red');
  /** Reference to the timer that changes the indicator to yellow */
  const timerYellow = useRef(null);
  /** Reference to the timer that changes the indicator to red */
  const timerRed = useRef(null);
  /** Reference to the timer that increments all elapsed times after 1 second */
  const timer = useRef(null);

  /**
     * Store the incoming activity in data with the elapsed field and calculate the difference.
     * Start the timers for the indicator color change.
     */
  useEffect(() => {
    if (activities && activities.length !== 0) {
      /** Calculate difference in times */
      const minuteDifference = activities[0].time.diff(dayjs(), 'minute');
      if (-minuteDifference <= 2) {
        /** Reset 1 second timer */
        if (timer.current != null) {
          clearTimeout(timer.current);
        }

        setColor('green');

        /** Reset timers */
        if (timerYellow.current != null && timerRed.current != null) {
          clearTimeout(timerYellow.current);
          clearTimeout(timerRed.current);
        }

        /** Start timers */
        timerYellow.current = setTimeout(() => {
          setColor('orange');
        }, 300000);
        timerRed.current = setTimeout(() => {
          setColor('red');
        }, 600000);
      }
    }
  }, [activities]);

  return (
    <div>
      <div className="sticky z-10 top-0">
        <div
          className={`flex justify-between py-2 px-5 border-gray-200 border-solid border-b transition-all duration-500 ease-in-out ${color === 'green' ? 'bg-green-100' : ''} ${color === 'orange' ? 'bg-orange-100' : ''} ${color === 'red' ? 'bg-red-100' : ''}`}
        >
          <div>
            <Clock />
          </div>

          <div className="pt-4">
            <SocketStatus
              status={socketStatus}
            />
            <FlightStatus />
          </div>

          <div className="pt-4">
            <GetHistoricalData
              amountOfComponents={layouts.lg.filter((el) => el.component.name === 'Chart').length}
            />
          </div>
        </div>
        <Menu mode="horizontal">
          <Menu.Item onClick={() => selectLayout('defaultPageLayout')}>
            Overview
          </Menu.Item>
          {
            Object.keys(tabs).map((tab) => (
              <Menu.Item
                key={tab}
                onClick={() => {
                  setLayouts(tabs[tab]);
                }}
              >
                <Badge status={tabsStatus[tab].status} />
                {tab}
              </Menu.Item>
            ))
          }
          <Menu.Item className="float-right">
            <LayoutSelector
              path={path}
              updateLayout={updateLayoutSelector}
              selectLayout={(value) => selectLayout(value)}
            />

            <Button
              key="savelayout"
              className="ml-3"
              type="primary"
              onClick={() => setFormVisible(true)}
            >
              Save Layout
            </Button>

            <Modal
              key="inputname"
              visible={formVisible}
              title="Save Current Layout"
              onCancel={() => setFormVisible(false)}
              okText="Save"
              cancelText="Cancel"
              onOk={() => {
                formSave.validateFields()
                  .then((values) => {
                    saveLayout(values.dashname);
                    setFormVisible(false);
                    formSave.resetFields();
                  });
              }}
            >
              <Form
                layout="vertical"
                form={formSave}
              >
                <Form.Item
                  name="dashname"
                  required
                  label="Dashboard Name"
                  rules={[{ required: true, message: 'Please enter a name for the layout.' }]}
                >
                  <Input
                    placeholder="Dashboard Name"
                  />
                </Form.Item>
              </Form>
            </Modal>
          </Menu.Item>
        </Menu>
      </div>
      <div className="mt-5 mx-16 mb-16">
        <ResponsiveGridLayout
          className="layout"
          breakpoints={breakpoints}
          cols={cols}
          layouts={layouts}
          margin={margin}
          draggableHandle=".dragHandle"
          draggableCancel=".preventDragHandle"
          rowHeight={20}
          isDroppable
          onDrop={(elemParams) => addToLayout(elemParams)}
        >
          {
              layouts !== null
                && layouts.lg !== null
                ? layouts.lg
                  .filter(
                    (layout) => layout && layout.i && layout.component && layout.component.name,
                  )
                  .map((layout) => (
                    <div
                      className="shadow overflow-y-scroll rounded component-color"
                      key={layout.i}
                    >
                      <AsyncComponent
                        component={layout.component.name}
                        props={layout.component.props}
                      />
                      <Button
                        className={`absolute bottom-0 left-0 z-50 mb-1 ml-1 ${visible ? 'block' : 'hidden'}`}
                        shape="circle"
                        layoutkey={layout.i}
                        icon={<CloseOutlined />}
                        onClick={(e) => deleteComponent(e)}
                      />
                    </div>
                  )) : null
            }
        </ResponsiveGridLayout>
        <Drawer
          placement="bottom"
          onClose={() => setVisible(false)}
          visible={visible}
          key="bottom"
          mask={false}
          height={height}
        >
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          {/* <div
            className="handlebar fixed z-30 w-full h-2"
            style={{ top: -5, left: -10 }}
            onMouseDown={(e) => {
              setOrigMouseY(e.clientY);
              window.addEventListener('mousemove', getMousePosition);
              window.addEventListener('mouseup', () => {
                setOrigMouseY(0);
                window.removeEventListener('mousemove', getMousePosition);
              });
            }}
          >
            &nbsp;
          </div> */}
          <Tabs defaultActiveKey="1">
            <TabPane tab="Add Components" key="1">
              <Divider orientation="left">1. Choose component</Divider>
              {
                Object.keys(components).map((piece) => (
                  <Button
                    key={piece}
                    className="mr-1"
                    keyid={piece}
                    onClick={(e) => retrieveInfo(e)}
                  >
                    {piece}
                  </Button>
                ))
              }
              <Divider orientation="left">
                <Space>2. Edit component&apos;s properties</Space>
              </Divider>
              <div className="flex">
                <pre className="flex-none language-json mb-2 h-64 w-2/4 overflow-y-scroll overflow-x-scroll resize-y cursor-text text-white">
                  <Editor
                    className="font-mono"
                    value={componentEditor}
                    onValueChange={(value) => setComponentEditor(value)}
                    highlight={(code) => highlight(code, languages.json)}
                    padding={10}
                  />
                </pre>
                <div className="flex-1 m-auto text-center">
                  <div>Height</div>
                  <Row justify="center">
                    <Col span={12}>
                      <Slider
                        min={2}
                        max={18}
                        onChange={(value) => changeDimensions(value, 'h')}
                        value={dimensions[1]}
                      />
                    </Col>
                    <Col span={4}>
                      <InputNumber
                        min={2}
                        max={18}
                        value={dimensions[1]}
                        onChange={(value) => changeDimensions(value, 'h')}
                      />
                    </Col>
                  </Row>
                  <br />
                  <div>Width</div>

                  <Row justify="center">
                    <Col span={12}>
                      <Slider
                        min={1}
                        max={12}
                        onChange={(value) => changeDimensions(value, 'w')}
                        value={dimensions[0]}
                      />
                    </Col>

                    <Col span={4}>
                      <InputNumber
                        min={1}
                        max={12}
                        value={dimensions[0]}
                        onChange={(value) => changeDimensions(value, 'w')}
                      />
                    </Col>
                  </Row>

                  <br />

                  <Button type="primary" onClick={() => addToLayout()}>Add Component to Layout</Button>
                </div>
              </div>

              <Divider orientation="left">Preview</Divider>

              {
                checkComponentJson() && JSON.parse(componentEditor).component.name
                  ? (
                    <div
                      className="shadow mt-5 mx-16 mb-16 overflow-y-scroll rounded component-color"
                      style={{ width: `${(dimensions[0] / 12) * 100}%`, height: `${dimensions[1] * 30}px` }}
                      draggable
                    >
                      <AsyncComponent
                        component={JSON.parse(componentEditor).component.name}
                        props={JSON.parse(componentEditor).component.props}
                        height={JSON.parse(componentEditor).h}
                      />
                    </div>
                  )
                  : null
              }
            </TabPane>
            <TabPane tab="JSON Editor" key="2">
              <Button
                onClick={() => processLayoutObject()}
              >
                Update Layout
              </Button>

              <span className="text-red-500 ml-3 mb-3">
                {formError}
              </span>

              <pre
                className="language-json mb-2 h-64 overflow-y-scroll overflow-x-scroll resize-y cursor-text text-white"
              >
                <Editor
                  className="font-mono"
                  value={jsonEdit}
                  onValueChange={(value) => setJsonEdit(value)}
                  highlight={(code) => highlight(code, languages.json)}
                  padding={10}
                />
              </pre>
            </TabPane>
          </Tabs>
        </Drawer>
        <Button
          className="fixed right-0 bottom-0 mb-5 mr-5"
          icon={<EditOutlined />}
          type="primary"
          onClick={() => setVisible(true)}
          shape="circle"
          size="large"
        />
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  /** Id of the dashboard */
  id: PropTypes.string.isRequired,
  /** Path of the desired dashboard */
  path: PropTypes.string.isRequired,
  /** The default layout for the path */
  defaultLayout: PropTypes.shape({}).isRequired,
  /** The realm that the layout is in */
  realms: PropTypes.shape(PropTypes.arrayOf(PropTypes.string)),
};

Dashboard.defaultProps = {
  realms: [],
};

export default React.memo(Dashboard);

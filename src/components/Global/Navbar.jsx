import React, { useState } from 'react';
import { Link } from '@reach/router';
import { Menu, Icon } from 'antd';

import routes from '../../routes';

/**
 * Automatically generated navgation bar, configured in the routes/index file.
 */
function Navbar() {
  /** Route that the user is currently on to display an accent denoting it as such */
  const [currentRoute] = useState('home');

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[currentRoute]}
    >
      {
        routes.map((route) => {
          if (route.children) {
            return (
              <Menu.SubMenu
                title={(
                  <span>
                    {
                      route.icon ? <Icon type={route.icon} /> : null
                    }
                    {route.name}
                  </span>
                )}
                key={route.name}
                className={route.rightAlign ? 'float-right' : null}
              >
                <Menu.ItemGroup
                  title="Routes"
                >
                  {
                    route.children.map((child) => (
                      <Menu.Item
                        key={child.name}
                      >
                        <Link
                          to={`/${route.path.split('/')[1]}${child.path}`}
                        >
                          {
                            child.icon ? <Icon type={child.icon} /> : null
                          }
                          {child.name}
                        </Link>
                      </Menu.Item>
                    ))
                  }
                </Menu.ItemGroup>
              </Menu.SubMenu>
            );
          }

          return (
            <Menu.Item
              key={route.name}
              className={route.rightAlign ? 'float-right' : null}
            >
              <Link to={route.path}>
                <Icon type={route.icon} />
                {route.name}
              </Link>
            </Menu.Item>
          );
        })
      }
    </Menu>
  );
}

export default Navbar;

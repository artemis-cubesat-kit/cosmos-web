export default {
  lg: [
    {
      i: 'satellite-neutron1-gps-a',
      x: 0,
      y: 0,
      w: 4,
      h: 12,
      component: {
        name: 'DisplayValue',
        props: {
          name: 'Mechanics',
          displayValues: [
            {
              name: 'Position',
              nodeProcess: 'any',
              dataKey: 'placeholder',
              timeDataKey: 'device_gps_utc_000',
              unit: 'm',
              processDataKey: (x) => JSON.stringify(x),
              live: true,
            },
            {
              name: 'Velocity',
              nodeProcess: 'any',
              dataKey: 'placeholder',
              timeDataKey: 'device_gps_utc_000',
              unit: 'm/s',
              processDataKey: (x) => JSON.stringify(x),
              live: true,
            },
            {
              name: 'Longitude',
              nodeProcess: 'any',
              dataKey: 'device_gps_geods_000',
              timeDataKey: 'device_gps_utc_000',
              unit: 'degrees',
              processDataKey: (x) => x.lon.toFixed(2),
              live: true,
            },
            {
              name: 'Latitude',
              nodeProcess: 'any',
              dataKey: 'device_gps_geods_000',
              timeDataKey: 'device_gps_utc_000',
              unit: 'degrees',
              processDataKey: (x) => x.lat.toFixed(2),
              live: true,
            },
            {
              name: 'Altitude',
              nodeProcess: 'any',
              dataKey: 'device_gps_geods_000',
              timeDataKey: 'device_gps_utc_000',
              unit: 'degrees',
              processDataKey: (x) => x.h.toFixed(2),
              live: true,
            },
          ],
        },
      },
    },
    {
      i: 'satellite-neutron1-gps-b',
      x: 4,
      y: 0,
      w: 5,
      h: 12,
      component: {
        name: 'DisplayValue',
        props: {
          name: 'Statuses',
          displayValues: [
            {
              name: 'Time',
              nodeProcess: 'any',
              dataKey: 'device_gps_time_status_000',
              timeDataKey: 'device_gps_utc_000',
              unit: '',
              processDataKey: (x) => x,
              live: true,
            },
            {
              name: 'Temperature',
              nodeProcess: 'any',
              dataKey: 'device_gps_temp_000',
              timeDataKey: 'device_gps_utc_000',
              unit: 'C',
              processDataKey: (x) => (x - 273.15).toFixed(2),
              processSecondaryDataKey: (x) => `${x.toFixed(2)}K`,
              live: true,
            },
            {
              name: 'GPS Position Lock Status',
              nodeProcess: 'any',
              dataKey: 'device_gps_solution_status_000',
              timeDataKey: 'device_gps_utc_000',
              unit: '',
              processDataKey: (x) => x,
              live: true,
            },
            {
              name: 'GPS Time Status',
              nodeProcess: 'any',
              dataKey: 'device_gps_time_status_000',
              timeDataKey: 'device_gps_utc_000',
              unit: '',
              processDataKey: (x) => x,
              live: true,
            },
            {
              name: 'Satellites Visible',
              nodeProcess: 'any',
              dataKey: 'device_gps_sats_visible_000',
              timeDataKey: 'device_gps_utc_000',
              unit: '',
              processDataKey: (x) => x,
              live: true,
            },
          ],
        },
      },
    },
    {
      i: 'satellite-neutron-gps-aa',
      x: 9,
      y: 0,
      w: 3,
      h: 12,
      component: {
        name: 'Image',
        props: {
          node: 'neutron1',
          name: 'GPS',
          file: 'GPS.png',
        },
      },
    },
    {
      i: 'satellite-neutron1-gps-e',
      x: 0,
      y: 1,
      w: 12,
      h: 18,
      component: {
        name: 'Chart',
        props: {
          name: 'Ground Position',
          plots: [
            {
              x: [],
              y: [],
              type: 'scatter',
              mode: 'lines+markers',
              marker: {
                color: 'red',
              },
              name: 'Longitude',
              YDataKey: 'placeholder',
              timeDataKey: 'placeholder',
              processYDataKey: (x) => x,
              nodeProcess: 'any',
              live: true,
            },
            {
              x: [],
              y: [],
              type: 'scatter',
              mode: 'lines+markers',
              marker: {
                color: 'orange',
              },
              name: 'Latitude',
              YDataKey: 'placeholder',
              timeDataKey: 'placeholder',
              processYDataKey: (x) => x,
              nodeProcess: 'any',
              live: true,
            },
            {
              x: [],
              y: [],
              type: 'scatter',
              mode: 'lines+markers',
              marker: {
                color: 'blue',
              },
              name: 'Altitude',
              YDataKey: 'placeholder',
              timeDataKey: 'placeholder',
              processYDataKey: (x) => x,
              nodeProcess: 'any',
              live: true,
            },
          ],
        },
      },
    },
    {
      i: 'satellite-neutron1-gps-f',
      x: 0,
      y: 2,
      w: 6,
      h: 18,
      component: {
        name: 'Chart',
        props: {
          name: 'Position',
          plots: [
            {
              x: [],
              y: [],
              type: 'scatter',
              mode: 'lines+markers',
              marker: {
                color: 'red',
              },
              name: 'Position X (m)',
              YDataKey: 'device_gps_geocs_000',
              timeDataKey: 'device_gps_utc_000',
              processYDataKey: (x) => x[0],
              nodeProcess: 'any',
              live: true,
            },
            {
              x: [],
              y: [],
              type: 'scatter',
              mode: 'lines+markers',
              marker: {
                color: 'orange',
              },
              name: 'Position Y (m)',
              YDataKey: 'device_gps_geocs_000',
              timeDataKey: 'device_gps_utc_000',
              processYDataKey: (x) => x[1],
              nodeProcess: 'any',
              live: true,
            },
            {
              x: [],
              y: [],
              type: 'scatter',
              mode: 'lines+markers',
              marker: {
                color: 'blue',
              },
              name: 'Position Z (m)',
              YDataKey: 'device_gps_geocs_000',
              timeDataKey: 'device_gps_utc_000',
              processYDataKey: (x) => x[2],
              nodeProcess: 'any',
              live: true,
            },
          ],
        },
      },
    },
    {
      i: 'satellite-neutron1-gps-g',
      x: 6,
      y: 2,
      w: 6,
      h: 18,
      component: {
        name: 'Chart',
        props: {
          name: 'Position',
          plots: [
            {
              x: [],
              y: [],
              type: 'scatter',
              mode: 'lines+markers',
              marker: {
                color: 'red',
              },
              name: 'Position X (m)',
              YDataKey: 'device_gps_geocv_000',
              timeDataKey: 'device_gps_utc_000',
              processYDataKey: (x) => x[0],
              nodeProcess: 'any',
              live: true,
            },
            {
              x: [],
              y: [],
              type: 'scatter',
              mode: 'lines+markers',
              marker: {
                color: 'orange',
              },
              name: 'Position Y (m)',
              YDataKey: 'device_gps_geocv_000',
              timeDataKey: 'device_gps_utc_000',
              processYDataKey: (x) => x[1],
              nodeProcess: 'any',
              live: true,
            },
            {
              x: [],
              y: [],
              type: 'scatter',
              mode: 'lines+markers',
              marker: {
                color: 'blue',
              },
              name: 'Position Z (m)',
              YDataKey: 'device_gps_geocv_000',
              timeDataKey: 'device_gps_utc_000',
              processYDataKey: (x) => x[2],
              nodeProcess: 'any',
              live: true,
            },
          ],
        },
      },
    },
    {
      i: 'satellite-neutron1-gps-h',
      x: 0,
      y: 3,
      w: 6,
      h: 18,
      component: {
        name: 'Chart',
        props: {
          name: 'GPS Position Lock Status',
          plots: [
            {
              x: [],
              y: [],
              type: 'scatter',
              mode: 'lines+markers',
              marker: {
                color: 'red',
              },
              name: 'GPS Position Lock Status',
              YDataKey: 'device_gps_solution_status_000',
              timeDataKey: 'device_gps_utc_000',
              processYDataKey: (x) => x,
              nodeProcess: 'any',
              live: true,
            },
          ],
        },
      },
    },
    {
      i: 'satellite-neutron1-gps-i',
      x: 6,
      y: 3,
      w: 6,
      h: 18,
      component: {
        name: 'Chart',
        props: {
          name: 'Satellites in View',
          plots: [
            {
              x: [],
              y: [],
              type: 'scatter',
              mode: 'lines+markers',
              marker: {
                color: 'red',
              },
              name: 'Satellites in View',
              YDataKey: 'device_gps_sats_visible_000',
              timeDataKey: 'device_gps_utc_000',
              processYDataKey: (x) => x,
              nodeProcess: 'any',
              live: true,
            },
          ],
        },
      },
    },
    {
      i: 'satellite-neutron1-gps-j',
      x: 0,
      y: 4,
      w: 12,
      h: 21,
      component: {
        name: 'Globe',
        props: {
          name: 'Orbit',
          orbits: [
            {
              name: 'neutron1',
              modelFileName: 'cubesat1.glb',
              nodeProcess: 'any',
              XDataKey: 'node_loc_pos_eci',
              YDataKey: 'node_loc_pos_eci',
              ZDataKey: 'node_loc_pos_eci',
              processXDataKey: (x) => x.pos[0],
              processYDataKey: (x) => x.pos[1],
              processZDataKey: (x) => x.pos[2],
              timeDataKey: 'node_utc',
              live: true,
              position: [21.289373, 157.917480, 350000.0],
              orientation: {
                d: {
                  x: 0,
                  y: 0,
                  z: 0,
                },
                w: 0,
              },
            },
          ],
          overlays: [
            {
              color: 'CRIMSON',
              geoJson: {
                type: 'Polygon',
                coordinates: [
                  [[30, 10], [40, 40], [20, 40], [10, 20], [30, 10]],
                ],
              },
            },
          ],
        },
      },
    },
  ],
};

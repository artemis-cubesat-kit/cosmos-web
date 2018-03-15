import React, { Component } from 'react';
import * as BABYLON from 'babylonjs';
import io from 'socket.io-client';
import satWorldView from '../scenes/satWorldView';
//import satRotView from './scenes/satRotView';

import '../App.css';
const scene = BABYLON.Scene;
const engine = BABYLON.Engine;
const canvas = HTMLCanvasElement;

class ThreeD extends Component {

    onResizeWindow = () => {
      if (this.engine) {
        this.engine.resize();
      }
    }

    componentDidMount () {
      this.engine = new BABYLON.Engine(
          this.canvas,
          true,
          this.props.engineOptions,
          this.props.adaptToDeviceRatio
      );

      let scene = new BABYLON.Scene(this.engine);
      this.scene = scene;

      if (typeof this.props.onSceneMount === 'function') {
        this.props.onSceneMount({
          scene,
          engine: this.engine,
          canvas: this.canvas
        });
      } else {
        console.error('onSceneMount function not available');
      }

      // Resize the babylon engine when the window is resized
      window.addEventListener('resize', this.onResizeWindow);
    }

    componentWillUnmount () {
      window.removeEventListener('resize', this.onResizeWindow);
    }

    onCanvasLoaded = (c : HTMLCanvasElement) => {
      if (c !== null) {
        this.canvas = c;
      }
    }

  render() {
    // 'rest' can contain additional properties that you can flow through to canvas:
    // (id, className, etc.)
    let { width, height, ...rest } = this.props;

    let opts: any = {};

    if (width !== undefined && height !== undefined) {
      opts.width = width;
      opts.height = height;
    }
    return (
      <div>
        <canvas
          id="satWorldView"
          ref={this.onCanvasLoaded}></canvas>
        {/* <canvas id="satRotView"></canvas> */}
      </div>
    );

  }
}

export default ThreeD;

import Api from './Api.js';
import Icons from './Icons.js';
import Utils from './Utils.js';
import Render from './Render.js';
import Demo from './Demo.js';
import App from './App.js';

const api = new Api();
const utils = new Utils();
const icons = new Icons();
const render = new Render(utils, icons);
const demo = new Demo(render, utils);

new App(api, utils, render, demo);

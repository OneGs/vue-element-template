import {createLocalVue, mount} from '@vue/test-utils';
import ElementUi from '../../src/index.js';

const localVue = createLocalVue();
localVue.use(ElementUi);

export const createElementMount = (options) => {
  return mount(options, { localVue });
};
export const triggerFocus = (element) => {
  // eslint-disable-next-line one-var
  let eventType = 'onfocusin' in element ? 'focusin' : 'focus',
    bubbles = 'onfocusin' in element,
    event;

  if ('createEvent' in document) {
    event = document.createEvent('Event');
    event.initEvent(eventType, bubbles, true);
  } else if ('Event' in window) {
    event = new Event(eventType, { bubbles: bubbles, cancelable: true });
  }

  element.focus();
  element.dispatchEvent(event);
};

/**
 * 等待 ms 毫秒，返回 Promise
 * @param {Number} ms
 */
export const wait = function(ms = 50) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
};

/**
 * 等待一个 Tick，代替 Vue.nextTick，返回 Promise
 */
export const waitImmediate = () => wait(0);

/**
 * 触发一个事件
 * mouseenter, mouseleave, mouseover, keyup, change, click 等
 * @param  {Element} elm
 * @param  {String} name
 * @param  {*} opts
 */
export const triggerEvent = function(elm, name, ...opts) {
  let eventName;

  if (/^mouse|click/.test(name)) {
    eventName = 'MouseEvents';
  } else if (/^key/.test(name)) {
    eventName = 'KeyboardEvent';
  } else {
    eventName = 'HTMLEvents';
  }
  const evt = document.createEvent(eventName);

  evt.initEvent(name, ...opts);
  elm.dispatchEvent
    ? elm.dispatchEvent(evt)
    : elm.fireEvent('on' + name, evt);

  return elm;
};

/**
 * 触发 “mouseup” 和 “mousedown” 事件
 * @param {Element} elm
 * @param {*} opts
 */
export const triggerClick = function(elm, ...opts) {
  triggerEvent(elm, 'mousedown', ...opts);
  triggerEvent(elm, 'mouseup', ...opts);

  return elm;
};

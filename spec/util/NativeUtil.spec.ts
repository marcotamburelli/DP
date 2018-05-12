import { JSDOM } from 'jsdom';

import { NativeUtil } from '../../src/util/NativeUtil';

const dom = new JSDOM(`<!DOCTYPE html><p>test</p>`);

// tslint:disable-next-line:no-string-literal
global['document'] = dom.window.document;

describe('Checking native utils', () => {

  it('Checking apply style', () => {
    const element = document.createElement('div');

    NativeUtil.applyProperty(element, { name: 'style', value: 'background-color: red; padding-top: 12px;' });

    expect(element.style.backgroundColor).toBe('red');
    expect(element.style.paddingTop).toBe('12px');
  });

  it('Checking apply class', () => {
    const element = document.createElement('div');

    NativeUtil.applyProperty(element, { name: 'class', value: ['class1', 'class2'] });

    expect(element.classList.item(0)).toBe('class1');
    expect(element.classList.item(1)).toBe('class2');
  });

  it('Checking apply events', (done) => {
    const element = document.createElement('div');

    NativeUtil.applyProperties(element, { onclick: () => done() });

    element.click();
  });
});

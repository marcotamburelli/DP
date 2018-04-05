import { JSDOM } from 'jsdom';

import { Container } from '../../src/component/Container';
import { DEFAULT_BIND } from '../../src/component/dom/DomBinder';
import { TextComponent } from '../../src/component/TextComponent';

const dom = new JSDOM(`<!DOCTYPE html><p>test</p>`);

// tslint:disable-next-line:no-string-literal
global['document'] = dom.window.document;

describe('Data in Text with custom binder', () => {

  const intBinder = {
    [DEFAULT_BIND]: { set: (n) => `${n}`, get: (v) => parseInt(v) }
  };

  it('checks append and data', () => {
    const element = document.createElement('div');
    const container = new Container(element);

    const text = new TextComponent<number>({ name: 'name' }, intBinder);

    container.append(text);

    container.setData({ name: 1 });

    expect(container.getData()).toEqual({ name: 1 });
    expect(container.domNode.innerHTML).toBe('1');
  });

});

describe('Text component and container', () => {

  it('checks append and data', () => {
    const element = document.createElement('div');
    const container = new Container(element);

    const text = new TextComponent({ name: 'name' });

    container.append(text);

    container.setData({ name: 'hello' });

    expect(container.getData()).toEqual({ name: 'hello' });
    expect(container.domNode.innerHTML).toBe('hello');

    container.remove(text);

    expect(container.getData()).toEqual({});
    expect(container.domNode.innerHTML).toBe('');
  });

});

import { JSDOM } from 'jsdom';

import { Container } from '../../src/component/Container';
import { TextComponent } from '../../src/component/TextComponent';

const dom = new JSDOM(`<!DOCTYPE html><p>test</p>`);

// tslint:disable-next-line:no-string-literal
global['document'] = dom.window.document;

describe('Text component', () => {

  it('Check append and model', () => {
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

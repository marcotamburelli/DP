import { JSDOM } from 'jsdom';

import { ScopeProperties } from '../../src/component/BaseComponent';
import { Container } from '../../src/component/Container';
import { HtmlElementComponent, TextInputComponent } from '../../src/component/HtmlComponents';
import { TextComponent } from '../../src/component/TextComponent';

const dom = new JSDOM(`<!DOCTYPE html><p>test</p>`);

// tslint:disable-next-line:no-string-literal
global['document'] = dom.window.document;

describe('Text component', () => {

  it('Check append and model', () => {
    const element = document.createElement('div');
    const container = new Container(element, { namespace: 'test' });

    const text = new TextComponent({ name: 'name' });

    container.append(text);

    container.setModel({ name: 'hello' });

    expect(container.getModel()).toEqual({ name: 'hello' });
    expect(container.domNode.innerHTML).toBe('hello');

    text.detach();

    expect(container.getModel()).toEqual({});
    expect(container.domNode.innerHTML).toBe('');
  });

});

import { JSDOM } from 'jsdom';

import { ScopeProperties } from '../../src/component/BaseComponent';
import { Container } from '../../src/component/Container';
import { HtmlElementComponent, TextInputComponent } from '../../src/component/HtmlComponents';

const dom = new JSDOM(`<!DOCTYPE html><p>test</p>`);

// tslint:disable-next-line:no-string-literal
global['document'] = dom.window.document;

describe('Scoped component', () => {

  class Scoped<M> extends Container<M, Element> {
    constructor(element: Element, props: ScopeProperties) {
      super(element, props);
    }

    get context() {
      return this.getContext();
    }
  }

  it('Check context namespace', () => {
    const element = document.createElement('div');
    const component = new Scoped(element, { namespace: 'test' });

    expect(component.context.namespace).toBe('test');
  });

  it('Check names in context', () => {
    const element = document.createElement('div');
    const childElement = document.createElement('input');

    const component = new Scoped(element, { namespace: 'test' });
    const child = new TextInputComponent(childElement, { id: 'id', name: 'name' }, (value) => value);

    component.append(child);

    expect(component.queryById('id').domNode).toEqual(childElement);
    expect(component.queryByName('name').domNode).toEqual(childElement);
  });

  it('Check nested contexts', () => {
    const element0 = document.createElement('div');
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');
    const element3 = document.createElement('div');

    const component0 = new Scoped(element0, { namespace: 'test.0' });
    const component1 = new HtmlElementComponent(element1);
    const component2 = new Scoped(element2, { namespace: 'test.1' });
    const component3 = new HtmlElementComponent(element3);

    component0.append(component1);
    component1.append(component2);
    component2.append(component3);

    expect(component0.context.getChildContext('test.1')).not.toBeNull();
  });

});

import { JSDOM } from 'jsdom';

import { ScopeProperties } from '../../src/component/BaseComponent';
import { HtmlElementComponent, TextInputComponent } from '../../src/component/HtmlComponents';
import { ScopedComponent } from '../../src/component/ScopedComponent';

const dom = new JSDOM(`<!DOCTYPE html><p>test</p>`);

// tslint:disable-next-line:no-string-literal
global['document'] = dom.window.document;

describe('Scoped component', () => {

  class Scoped<M> extends ScopedComponent<Element, M> {
    constructor(element: Element, props: ScopeProperties) {
      super(element, props);
    }

    get scope() {
      return this.getScope();
    }
  }

  it('Check scope', () => {
    const element = document.createElement('div');
    const component = new Scoped(element, { namespace: 'test' });

    expect(component.scope).toEqual({
      namespace: 'test',
      idsMap: {},
      namesMap: {},
      childScopes: {}
    });
  });

  it('Check names in scope', () => {
    const element = document.createElement('div');
    const childElement = document.createElement('input');

    const component = new Scoped(element, { namespace: 'test' });
    const child = new TextInputComponent(childElement, { id: 'id', name: 'name' }, (value) => value);

    component.append(child);

    expect(component.scope).toEqual({
      namespace: 'test',
      idsMap: { ['id']: child },
      namesMap: { ['name']: child },
      childScopes: {}
    });
  });

  it('Check nested scope', () => {
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

    expect(component0.scope).toEqual({
      namespace: 'test.0',
      idsMap: {},
      namesMap: {},
      childScopes: {
        ['test.1']: {
          namespace: 'test.1',
          idsMap: {},
          namesMap: {},
          childScopes: {}
        }
      }
    });
  });

});

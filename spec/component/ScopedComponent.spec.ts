import { JSDOM } from 'jsdom';

import { ScopeProperties } from '../../src/component/BaseComponent';
import { TextInputComponent } from '../../src/component/HtmlComponents';
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
    const element = document.createElement('div');
    const childElement = document.createElement('div');

    const component = new Scoped(element, { namespace: 'test.0' });
    const child = new Scoped(childElement, { namespace: 'test.1' });

    component.append(child);

    expect(component.scope).toEqual({
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

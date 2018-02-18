import { JSDOM } from 'jsdom';

import { ScopeProperties } from '../../src/component/BaseComponent';
import { Container } from '../../src/component/Container';
import { HtmlElementComponent, TextInputComponent } from '../../src/component/HtmlComponents';

const dom = new JSDOM(`<!DOCTYPE html><p>test</p>`);

// tslint:disable-next-line:no-string-literal
global['document'] = dom.window.document;

describe('Scoped component', () => {

  function propertiesGenerator(name: string, id: string) {
    const controlElement = document.createElement('div');

    return new HtmlElementComponent(controlElement, { id, name }, (value) => value);
  }

  it('Check simple properties', () => {
    const element = document.createElement('div');
    const container = new Container(element, { namespace: 'test' });

    const control1 = propertiesGenerator('name_1', '1');
    const control2 = propertiesGenerator('name_2', '2');

    container.append(control1);
    container.append(control2);

    container.setModel({ 'name_1': 'value_1', 'name_2': 'value_2' });

    expect(container.getModel()).toEqual({ 'name_1': 'value_1', 'name_2': 'value_2' });

    control2.detach();

    expect(container.getModel()).toEqual({ 'name_1': 'value_1' });
  });

  it('Check object properties', () => {
    const element = document.createElement('div');
    const childElement = document.createElement('div');

    const container = new Container(element, { namespace: 'test' });
    const childContainer = new Container(childElement, { namespace: 'child', name: 'obj' });

    container.append(childContainer);

    childContainer.append(propertiesGenerator('name_1', '1'));
    childContainer.append(propertiesGenerator('name_2', '2'));

    container.setModel({ obj: { 'name_1': 'value_1', 'name_2': 'value_2' } });

    expect(container.getModel()).toEqual({ obj: { 'name_1': 'value_1', 'name_2': 'value_2' } });

    childContainer.detach();

    expect(container.getModel()).toEqual({});
  });

});

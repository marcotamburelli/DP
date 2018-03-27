import { JSDOM } from 'jsdom';

import { Container } from '../../src/component/Container';
import { HtmlElementComponent, RadioInputComponent } from '../../src/component/HtmlComponents';

const dom = new JSDOM(`<!DOCTYPE html><p>test</p>`);

// tslint:disable-next-line:no-string-literal
global['document'] = dom.window.document;

describe('Scoped component', () => {

  function propertiesGenerator(name: string, id: string) {
    const controlElement = document.createElement('div');

    return new HtmlElementComponent(controlElement, { id, name }, {}, (value) => value);
  }

  function radioElement(name: string, value: string) {
    const radioInput = document.createElement('input');
    radioInput.type = 'radio';
    radioInput.value = value;
    radioInput.name = name;

    return new RadioInputComponent(radioInput, { name }, {}, (v) => v);
  }

  it('Check radio button', () => {
    const element = document.createElement('div');
    const container = new Container(element, { name: 'test' });

    const control1 = propertiesGenerator('name_1', '1');
    const control2 = propertiesGenerator('name_2', '2');

    container.append(control1);
    container.append(control2);

    container.setData({ name_1: 'value_1', name_2: 'value_2' });

    expect(container.getData()).toEqual({ name_1: 'value_1', name_2: 'value_2' });

    container.remove(control2);

    expect(container.getData()).toEqual({ name_1: 'value_1' });
  });

  it('Check simple properties', () => {
    const element = document.createElement('div');
    const container = new Container(element, { name: 'test' });

    const control1 = radioElement('name', 'val_1');
    const control2 = radioElement('name', 'val_2');

    container.append(control1);
    container.append(control2);

    container.setData({ name: 'val_1' });

    expect(control1.domNode.checked).toBe(true);
    expect(control2.domNode.checked).toBe(false);

    control2.domNode.checked = true;

    expect(container.getData()).toEqual({ name: 'val_2' });
  });

  it('Check empty data', () => {
    const container = new Container(document.createElement('div'), { name: 'test' });
    const subContainer = new Container(document.createElement('div'));

    const control1 = propertiesGenerator('name_1', '1');
    const control2 = propertiesGenerator('name_2', '2');

    container.append(subContainer);
    subContainer.append(control1);
    subContainer.append(control2);

    container.setData({});

    expect(container.getData()).toEqual({ name_1: '', name_2: '' });
  });

  it('Check object properties', () => {
    const element = document.createElement('div');
    const childElement = document.createElement('div');

    const container = new Container(element);
    const childContainer = new Container(childElement, { name: 'obj' });

    container.append(childContainer);

    childContainer.append(propertiesGenerator('name_1', '1'));
    childContainer.append(propertiesGenerator('name_2', '2'));

    container.setData({ obj: { name_1: 'value_1', name_2: 'value_2' } });

    expect(container.getData()).toEqual({ obj: { name_1: 'value_1', name_2: 'value_2' } });

    container.remove(childContainer);

    expect(container.getData()).toEqual({});
  });

  it('Check query by id of missing element', () => {
    const element = document.createElement('div');
    const childElement = document.createElement('div');

    const container = new Container(element);
    const childContainer = new Container(childElement, { name: 'obj' });

    container.append(childContainer);

    childContainer.append(propertiesGenerator('name_1', '1'));
    childContainer.append(propertiesGenerator('name_2', '2'));

    expect(container.queryById('')).toBeUndefined();
  });

});

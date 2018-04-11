import { JSDOM } from 'jsdom';

import { Container } from '../../src/component/Container';
import { DomBinder } from '../../src/component/dom/DomBinder';
import { GroupContainer } from '../../src/component/GroupContainer';
import { HtmlElementComponent, RadioInputComponent } from '../../src/component/HtmlComponents';
import { ListContainer } from '../../src/component/ListContainer';
import { TextComponent } from '../../src/component/TextComponent';

const dom = new JSDOM(`<!DOCTYPE html><p>test</p>`);

// tslint:disable-next-line:no-string-literal
global['document'] = dom.window.document;

function createSimpleHtml(name: string, id: string) {
  const controlElement = document.createElement('div');

  controlElement.id = id;

  return new HtmlElementComponent<HTMLDivElement>(controlElement, { name }, {});
}

function createRadio(name: string, value: string) {
  const radioInput = document.createElement('input');
  radioInput.type = 'radio';
  radioInput.value = value;
  radioInput.name = name;

  return new RadioInputComponent(radioInput, { name }, {});
}

describe('Query inside the container', () => {

  it('checks query by id of missing and existing element', () => {
    const element = document.createElement('div');
    const childElement = document.createElement('div');

    const container = new Container(element);
    const childContainer = new Container(childElement, { name: 'obj' });

    container.append(childContainer);

    const child1 = createSimpleHtml('name_1', '1');
    const child2 = createSimpleHtml('name_2', '2');

    childContainer.append(child1);
    childContainer.append(child2);

    expect(container.queryById('')).toBeUndefined();
    expect(container.queryById('3')).toBeUndefined();
    expect(container.queryById('1')).toBe(child1);

    child1.domNode.id = 'new_id';

    expect(container.queryById('new_id')).toBe(child1);
  });

  it('checks query of group', () => {
    const element = document.createElement('div');
    const container = new Container(element);
    const group = new GroupContainer({ name: 'obj' }, { id: '1' });

    container.append(group);

    expect(container.queryById('')).toBeUndefined();
    expect(container.queryById('3')).toBeUndefined();
    expect(container.queryById('1')).toBe(group);
  });

  it('checks query of list', () => {
    const element = document.createElement('div');
    const container = new Container(element);
    const list = new ListContainer<any>(null, { name: 'obj' }, { id: '1' });

    container.append(list);

    expect(container.queryById('')).toBeUndefined();
    expect(container.queryById('3')).toBeUndefined();
    expect(container.queryById('1')).toBe(list);
  });

  it('checks query of text', () => {
    const element = document.createElement('div');
    const container = new Container(element);
    const text = new TextComponent({ name: 'name' }, {}, { id: '1' });

    container.append(text);

    expect(container.queryById('')).toBeUndefined();
    expect(container.queryById('3')).toBeUndefined();
    expect(container.queryById('1')).toBe(text);
  });

});

describe('Data in container with identity binder', () => {

  it('checks simple properties', () => {
    const element = document.createElement('div');
    const container = new Container(element, { name: 'test' });

    const control1 = createSimpleHtml('name_1', '1');
    const control2 = createSimpleHtml('name_2', '2');

    container.append(control1);
    container.append(control2);

    container.setData({ name_1: 'value_1', name_2: 'value_2' });

    expect(container.getData()).toEqual({ name_1: 'value_1', name_2: 'value_2' });

    container.remove(control2);

    expect(container.getData()).toEqual({ name_1: 'value_1' });
  });

  it('checks radio buttons', () => {
    const element = document.createElement('div');
    const container = new Container(element, { name: 'test' });

    const control1 = createRadio('name', 'val_1');
    const control2 = createRadio('name', 'val_2');

    container.append(control1);
    container.append(control2);

    container.setData({ name: 'val_1' });

    expect(control1.domNode.checked).toBe(true);
    expect(control2.domNode.checked).toBe(false);

    control2.domNode.checked = true;

    expect(container.getData()).toEqual({ name: 'val_2' });
  });

  it('checks empty data', () => {
    const container = new Container(document.createElement('div'), { name: 'test' });
    const subContainer = new Container(document.createElement('div'));

    const control1 = createSimpleHtml('name_1', '1');
    const control2 = createSimpleHtml('name_2', '2');

    container.append(subContainer);
    subContainer.append(control1);
    subContainer.append(control2);

    container.setData({});

    expect(container.getData()).toEqual({ name_1: '', name_2: '' });
  });

  it('checks object properties', () => {
    const element = document.createElement('div');
    const childElement = document.createElement('div');

    const container = new Container(element);
    const childContainer = new Container(childElement, { name: 'obj' });

    container.append(childContainer);

    childContainer.append(createSimpleHtml('name_1', '1'));
    childContainer.append(createSimpleHtml('name_2', '2'));

    container.setData({ obj: { name_1: 'value_1', name_2: 'value_2' } });

    expect(container.getData()).toEqual({ obj: { name_1: 'value_1', name_2: 'value_2' } });

    container.remove(childContainer);

    expect(container.getData()).toEqual({});
  });

});

describe('Data in container with custom binder', () => {

  it('checks ID attribute', () => {
    const element = document.createElement('div');
    const container = new Container(element, { name: 'test' }, { id: DomBinder.IDENTITY_BINDER });
    const control1 = createSimpleHtml('name', '1');

    container.append(control1);

    container.setData({ name: 'hello', id: '#1' });

    expect(control1.domNode.textContent).toBe('hello');
    expect(element.id).toBe('#1');

    element.id = '#2';

    expect(container.getData()).toEqual({ name: 'hello', id: '#2' });
  });

  it('checks class attribute', () => {
    const element = document.createElement('div');
    const container = new Container(element, { name: 'test' }, { class: DomBinder.IDENTITY_BINDER });
    const control1 = createSimpleHtml('name', '1');

    container.append(control1);

    container.setData({ name: 'hello', class: ['class1', 'class2'] });

    expect(control1.domNode.textContent).toBe('hello');
    expect(element.classList.contains('class1')).toBe(true);
    expect(element.classList.contains('class2')).toBe(true);

    element.classList.remove('class2');

    expect(container.getData()).toEqual({ name: 'hello', class: ['class1'] });
  });

  it('checks style attribute', () => {
    const element = document.createElement('div');
    const container = new Container(element, { name: 'test' }, { style: DomBinder.IDENTITY_BINDER });
    const control1 = createSimpleHtml('name', '1');

    container.append(control1);

    container.setData({ name: 'hello', style: { backgroundColor: 'red' } });

    expect(control1.domNode.textContent).toBe('hello');
    expect(element.style.backgroundColor).toBe('red');

    element.style.width = '10px';

    expect(container.getData()).toEqual({ name: 'hello', style: { backgroundColor: 'red', width: '10px' } });
  });

});

describe('Attaching and removing component', () => {

  it('attaches and removes simple HTML', () => {
    const element = document.createElement('div');
    const container = new Container(element, { name: 'test' });
    const control = createSimpleHtml('name', '1');

    container.append(control);

    expect(element.childElementCount).toBe(1);

    container.remove(control);

    expect(element.childElementCount).toBe(0);
  });

});

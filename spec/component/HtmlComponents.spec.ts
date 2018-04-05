import { JSDOM } from 'jsdom';

import { DEFAULT_BIND, DomBinder } from '../../src/component/dom/DomBinder';
import {
  CheckBoxInputComponent,
  HtmlElementComponent,
  RadioInputComponent,
  SelectComponent,
  TextInputComponent
} from '../../src/component/HtmlComponents';

const dom = new JSDOM(`<!DOCTYPE html><p>test</p>`);

// tslint:disable-next-line:no-string-literal
global['document'] = dom.window.document;

describe('Data in HTML components with identity binder', () => {

  it('binds text content ', () => {
    const element = document.createElement('div');
    const component = new HtmlElementComponent<string>(element, { name: 'name' });

    component.setData('hello');
    expect(component.domNode.textContent).toBe('hello');
    component.domNode.textContent = 'updated';
    expect(component.getData()).toBe('updated');
  });

  it('binds value', () => {
    const element = document.createElement('input');

    element.type = 'text';

    const component = new TextInputComponent<string>(element, { name: 'name' });

    component.setData('hello');
    expect(component.domNode.value).toBe('hello');
    component.domNode.value = 'updated';
    expect(component.getData()).toBe('updated');
  });

  it('binds checked checkbox', () => {
    const element = document.createElement('input');

    element.type = 'checkbox';

    const component = new CheckBoxInputComponent<boolean>(element, { name: 'name' });

    component.setData(true);
    expect(component.domNode.checked).toBe(true);
    component.domNode.checked = false;
    expect(component.getData()).toBe(false);
  });

  it('binds selected option', () => {
    const element = document.createElement('select');
    const opt1 = document.createElement('option');
    const opt2 = document.createElement('option');

    opt1.value = 'opt1';
    opt2.value = 'opt2';
    element.appendChild(opt1);
    element.appendChild(opt2);

    const component = new SelectComponent<string>(element, { name: 'name' });

    component.setData('opt1');
    expect(component.domNode.value).toBe('opt1');
    component.domNode.value = 'opt2';
    expect(component.getData()).toBe('opt2');
  });

  it('binds selected multiple options', () => {
    const element = document.createElement('select');
    const opt1 = document.createElement('option');
    const opt2 = document.createElement('option');

    opt1.value = 'opt1';
    opt2.value = 'opt2';
    element.multiple = true;
    element.appendChild(opt1);
    element.appendChild(opt2);

    const component = new SelectComponent<string>(element, { name: 'name' });

    component.setData(['opt1']);
    expect(component.domNode.options.item(0).selected).toBe(true);
    component.domNode.options.item(1).selected = true;
    expect(component.getData()).toEqual(['opt1', 'opt2']);
  });

  it('binds checked radio', () => {
    const element = document.createElement('input');

    element.type = 'radio';
    element.value = 'hello';

    const component = new RadioInputComponent<string>(element, { name: 'name' });

    component.setData('hello');
    expect(component.domNode.checked).toBe(true);
    expect(component.getData()).toBe('hello');
    component.domNode.checked = false;
    expect(component.getData()).toBeUndefined();
    component.setData('another');
    expect(component.getData()).toBeUndefined();
  });

});

describe('Data in HTML components with custom binding', () => {

  const intBinder = {
    [DEFAULT_BIND]: { set: (n) => `${n}`, get: (v) => parseInt(v) }
  };

  const checkedBinder = {
    [DEFAULT_BIND]: { set: (checked) => checked === 'checked', get: (v) => v ? 'checked' : null }
  };

  it('binds ID property', () => {
    const element = document.createElement('div');
    const component = new HtmlElementComponent<{ id: string }>(element, { name: 'name' }, { id: DomBinder.IDENTITY_BINDER });

    element.id = 'hello';

    expect(component.getData()).toEqual({ id: 'hello' });
    component.setData({ id: 'world' });
    expect(component.domNode.id).toEqual('world');
  });

  it('binds text content ', () => {
    const element = document.createElement('div');
    const component = new HtmlElementComponent<number>(element, { name: 'name' }, intBinder);

    component.setData(123);
    expect(component.domNode.textContent).toBe('123');
    component.domNode.textContent = '321';
    expect(component.getData()).toBe(321);
  });

  it('binds value', () => {
    const element = document.createElement('input');

    element.type = 'text';

    const component = new TextInputComponent<number>(element, { name: 'name' }, intBinder);

    component.setData(123);
    expect(component.domNode.value).toBe('123');
    component.domNode.value = '321';
    expect(component.getData()).toBe(321);
  });

  it('binds checked checkbox', () => {
    const element = document.createElement('input');

    element.type = 'checkbox';

    const component = new CheckBoxInputComponent<string>(element, { name: 'name' }, checkedBinder);

    component.setData('checked');
    expect(component.domNode.checked).toBe(true);
    component.domNode.checked = false;
    expect(component.getData()).toBeNull();
  });

  it('binds selected option', () => {
    const element = document.createElement('select');
    const opt1 = document.createElement('option');
    const opt2 = document.createElement('option');

    opt1.value = '1';
    opt2.value = '2';
    element.appendChild(opt1);
    element.appendChild(opt2);

    const component = new SelectComponent<number>(element, { name: 'name' }, intBinder);

    component.setData(1);
    expect(component.domNode.value).toBe('1');
    component.domNode.value = '2';
    expect(component.getData()).toBe(2);
  });

  it('binds selected multiple options', () => {
    const element = document.createElement('select');
    const opt1 = document.createElement('option');
    const opt2 = document.createElement('option');

    opt1.value = '1';
    opt2.value = '2';
    element.multiple = true;
    element.appendChild(opt1);
    element.appendChild(opt2);

    const component = new SelectComponent<number>(element, { name: 'name' }, intBinder);

    component.setData([1]);
    expect(component.domNode.options.item(0).selected).toBe(true);
    component.domNode.options.item(1).selected = true;
    expect(component.getData()).toEqual([1, 2]);
  });

  it('binds checked radio', () => {
    const element = document.createElement('input');

    element.type = 'radio';
    element.value = '10';

    const component = new RadioInputComponent<number>(element, { name: 'name' }, intBinder);

    component.setData(10);
    expect(component.domNode.checked).toBe(true);
    component.domNode.checked = false;
    expect(component.getData()).toBeUndefined();
    component.setData(20);
    expect(component.getData()).toBeUndefined();
  });

});

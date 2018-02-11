import { JSDOM } from 'jsdom';

import { XLib } from '../src/XLib';

const dom = new JSDOM(`<!DOCTYPE html><p>test</p>`);

// tslint:disable-next-line:no-string-literal
global['document'] = dom.window.document;

describe('Checking single model', () => {

  it('Checking html', () => {
    var div: XLib.ControlComponent<number> = XLib.define(
      'div',
      { 'name': 'val', 'value-type': 'number' }
    );
    const nativeDiv = div.domNode as HTMLDivElement;

    div.setModel(123);

    expect(nativeDiv.innerText).toBe('123');
  });

  it('Checking input', () => {
    var input: XLib.ControlComponent<number> = XLib.define(
      'input',
      { 'name': 'val', 'value-type': 'number' }
    );
    var nativeInput = input.domNode as HTMLInputElement;

    input.setModel(123);

    expect(nativeInput.value).toBe('123');

    nativeInput.value = '456';

    expect(input.getModel()).toBe(456);
  });

});

describe('Checking scoped component', () => {

  interface TestModel {
    name: string;
    age: number;
  }

  it('Check model', () => {
    var component = XLib.define(
      'div', { namespace: 'test' },
      XLib.define('input', { 'name': 'name', 'value-type': 'string' }),
      XLib.define('input', { 'name': 'age', 'value-type': 'number' })
    ) as XLib.Container<TestModel>;

    component.setModel({ name: 'test', age: 123 });

    var nameInput = component.queryByName('name').domNode as HTMLInputElement;
    var ageInput = component.queryByName('age').domNode as HTMLInputElement;

    expect(nameInput.value).toBe('test');
    expect(ageInput.value).toBe('123');

    nameInput.value = 'test test';
    ageInput.value = '456';

    expect(component.getModel()).toEqual({ name: 'test test', age: 456 });
  });

});

import { JSDOM } from 'jsdom';

import { Hello } from '../src/Builder';

const dom = new JSDOM(`<!DOCTYPE html><p>test</p>`);

// tslint:disable-next-line:no-string-literal
global['document'] = dom.window.document;

describe('Checking single model', () => {

  it('Checking html', () => {
    var div: Hello.ControlComponent<number> = Hello.define(
      'div',
      { 'name': 'val', 'value-type': 'number' }
    );
    const nativeDiv = div.domNode as HTMLDivElement;

    div.setModel(123);

    expect(nativeDiv.innerText).toBe('123');
  });

  it('Checking input', () => {
    var input: Hello.ControlComponent<number> = Hello.define(
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
    var component = Hello.define(
      'div', { namespace: 'test' },
      Hello.define('input', { 'name': 'name', 'value-type': 'string' }),
      Hello.define('input', { 'name': 'age', 'value-type': 'number' })
    ) as Hello.Container<TestModel>;

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

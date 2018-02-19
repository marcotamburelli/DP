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

  interface TypeModel {
    type: string;
    name: string;
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

  it('Check select with array', () => {
    function generator(model: { id: string, text: string }) {
      return XLib.define('option', { value: model.id }, model.text);
    }

    var component = XLib.define(
      'div', { namespace: 'test' },
      XLib.define(
        'select', { 'name': 'type', 'value-type': 'string' },
        XLib.List({ generator, id: 'list' })),
      XLib.define('input', { 'name': 'name', 'value-type': 'string' })
    ) as XLib.Container<TypeModel>;

    component.queryById('list').setModel([{ id: 'a', text: '_a' }, { id: 'b', text: '_b' }]);
    component.setModel({ name: 'text_name', type: 'a' });

    var typeSelect = component.queryByName('type').domNode as HTMLSelectElement;
    var nameInput = component.queryByName('name').domNode as HTMLInputElement;

    expect(typeSelect.value).toBe('a');
    expect(nameInput.value).toBe('text_name');

    typeSelect.value = 'test test';
    typeSelect.options.item(1).selected = true;
    // nameInput.value = 'b';

    expect(component.getModel()).toEqual({ name: 'test test', type: 'b' });
  });

});

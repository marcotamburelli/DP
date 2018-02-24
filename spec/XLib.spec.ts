import { JSDOM } from 'jsdom';

import { XLib } from '../src/XLib';

const dom = new JSDOM(`<!DOCTYPE html><p>test</p>`);

// tslint:disable-next-line:no-string-literal
global['document'] = dom.window.document;

describe('Checking single model', () => {

  it('Checking html', () => {
    var div: XLib.ControlComponent<number> = XLib.define(
      'div', { 'name': 'val', 'value-type': 'number' },
      '321'
    );

    expect(div.getData()).toBe(321);

    div.setData(123);

    expect((div.domNode as HTMLDivElement).textContent).toBe('123');
  });

  it('Checking input', () => {
    var input: XLib.ControlComponent<number> = XLib.define(
      'input',
      { 'name': 'val', 'value-type': 'number' }
    );
    var nativeInput = input.domNode as HTMLInputElement;

    input.setData(123);

    expect(nativeInput.value).toBe('123');

    nativeInput.value = '456';

    expect(input.getData()).toBe(456);
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
    var component: XLib.Container<TestModel> = XLib.define(
      'div', null,
      XLib.define('input', { 'name': 'name', 'value-type': 'string' }),
      XLib.define('input', { 'name': 'age', 'value-type': 'number' })
    );

    component.setData({ name: 'test', age: 123 });

    var nameInput = component.queryByName<XLib.Container<string>>('name').domNode as HTMLSelectElement;
    var ageInput = component.queryByName<XLib.Container<number>>('age').domNode as HTMLSelectElement;

    expect(nameInput.value).toBe('test');
    expect(ageInput.value).toBe('123');

    nameInput.value = 'test test';
    ageInput.value = '456';

    expect(component.getData()).toEqual({ name: 'test test', age: 456 });
  });

  it('Check select with array', () => {
    function generator(model: { id: string, text: string }) {
      return XLib.define('option', { value: model.id }, model.text);
    }

    var component: XLib.Container<TypeModel> = XLib.define(
      'div', null,
      XLib.define(
        'select', { 'name': 'type', 'value-type': 'string' },
        XLib.List({ generator, id: 'list' })),
      XLib.define('input', { 'name': 'name', 'value-type': 'string' })
    );

    component.queryById<XLib.ListContainer<any>>('list').setData([{ id: 'a', text: '_a' }, { id: 'b', text: '_b' }]);
    component.setData({ name: 'text_name', type: 'a' });

    var typeSelect = component.queryByName<XLib.ControlComponent<string>>('type').domNode as HTMLSelectElement;
    var nameInput = component.queryByName<XLib.ControlComponent<string>>('name').domNode as HTMLInputElement;

    expect(typeSelect.value).toBe('a');
    expect(nameInput.value).toBe('text_name');

    nameInput.value = 'test test';
    typeSelect.options.item(1).selected = true;

    expect(component.getData()).toEqual({ name: 'test test', type: 'b' });
  });

});

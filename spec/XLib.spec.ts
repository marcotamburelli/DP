import { JSDOM } from 'jsdom';
import * as Observable from 'zen-observable';

import { XLib } from '../src/XLib';

const dom = new JSDOM(`<!DOCTYPE html><p>test</p>`);

// tslint:disable-next-line:no-string-literal
global['document'] = dom.window.document;

describe('Checking single model', () => {

  it('Checking html', () => {
    var div: XLib.ControlComponent<number, HTMLDivElement> = XLib.define(
      'div', { 'name': 'val', 'value-type': 'number' },
      '321'
    );

    expect(div.getData()).toBe(321);

    div.setData(123);

    expect(div.domNode.textContent).toBe('123');
  });

  it('Checking input', () => {
    var input: XLib.ControlComponent<number, HTMLInputElement> = XLib.define(
      'input',
      { 'name': 'val', 'value-type': 'number' }
    );
    var nativeInput = input.domNode;

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
    var component: XLib.Container<TestModel, HTMLDivElement> = XLib.define(
      'div', null,
      XLib.define('input', { 'name': 'name', 'value-type': 'string' }),
      XLib.define('input', { 'name': 'age', 'value-type': 'number' })
    );

    component.setData({ name: 'test', age: 123 });

    var nameInput = component.queryByName<XLib.Container<string, HTMLInputElement>>('name').domNode;
    var ageInput = component.queryByName<XLib.Container<number, HTMLInputElement>>('age').domNode;

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

    var component: XLib.Container<TypeModel, HTMLDivElement> = XLib.define(
      'div', null,
      XLib.define(
        'select', { 'name': 'type', 'value-type': 'string' },
        XLib.List({ generator, id: 'list' })),
      XLib.define('input', { 'name': 'name', 'value-type': 'string' })
    );

    component.queryById<XLib.ListContainer<any>>('list').setData([{ id: 'a', text: '_a' }, { id: 'b', text: '_b' }]);
    component.setData({ name: 'text_name', type: 'a' });

    var typeSelect = component.queryByName<XLib.ControlComponent<string, HTMLSelectElement>>('type').domNode;
    var nameInput = component.queryByName<XLib.ControlComponent<string, HTMLInputElement>>('name').domNode;

    expect(typeSelect.value).toBe('a');
    expect(nameInput.value).toBe('text_name');

    nameInput.value = 'test test';
    typeSelect.options.item(1).selected = true;

    expect(component.getData()).toEqual({ name: 'test test', type: 'b' });
  });

  it('Check observer', (done) => {
    var component: XLib.Container<TestModel, HTMLDivElement> = XLib.define(
      'div', null,
      XLib.define('button', { id: 'button_1', 'onclick': { eventType: 'EVENT', emitter: () => 'PAYLOAD_1' } }),
      XLib.define('button', { id: 'button_2', 'onclick': { eventType: 'EVENT', emitter: () => 'PAYLOAD_2' } })
    );

    var observable = Observable.from(component.createObservable('EVENT') as any);
    var count = 0;

    var subscription = observable.subscribe(({ payload }) => {
      count++;

      expect(payload).toBe(count === 1 ? 'PAYLOAD_1' : 'PAYLOAD_2');

      if (count > 1) {
        subscription.unsubscribe();
        done();
      }
    });

    component.queryById<XLib.ControlComponent<any, HTMLButtonElement>>('button_1').domNode.click();
    component.queryById<XLib.ControlComponent<any, HTMLButtonElement>>('button_2').domNode.click();
  });
});

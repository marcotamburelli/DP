import { JSDOM } from 'jsdom';
import * as Observable from 'zen-observable';

import { dp } from '../src/dp';

const dom = new JSDOM(`<!DOCTYPE html><p>test</p>`);

// tslint:disable-next-line:no-string-literal
global['document'] = dom.window.document;

describe('Checking single model', () => {

  it('Checking html', () => {
    var div: dp.Component<number, HTMLDivElement> = dp.define(
      'div', { 'name': 'val', 'value-type': 'number' },
      '321'
    );

    expect(div.getData()).toBe(321);

    div.setData(123);

    expect(div.domNode.textContent).toBe('123');
  });

  it('Checking html', () => {
    var div: dp.Component<number, HTMLDivElement> = dp.define(
      'div', { 'name': 'val', 'value-type': 'number' },
      321
    );

    expect(div.getData()).toBe(321);

    div.setData(123);

    expect(div.domNode.textContent).toBe('123');
  });

  it('Checking input', () => {
    var input: dp.Component<number, HTMLInputElement> = dp.define(
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

  interface RadioModel {
    age: number;
  }

  it('Check model', () => {
    var component: dp.Container<TestModel, HTMLDivElement> = dp.define(
      'div', null,
      dp.define('input', { 'name': 'name', 'value-type': 'string' }),
      dp.define('input', { 'name': 'age', 'value-type': 'number' })
    );

    component.setData({ name: 'test', age: 123 });

    var nameInput = component.queryByName<dp.Container<string, HTMLInputElement>>('name')[0].domNode;
    var ageInput = component.queryByName<dp.Container<number, HTMLInputElement>>('age')[0].domNode;

    expect(nameInput.value).toBe('test');
    expect(ageInput.value).toBe('123');

    nameInput.value = 'test test';
    ageInput.value = '456';

    expect(component.getData()).toEqual({ name: 'test test', age: 456 });
  });

  it('Check radio group', () => {
    var component: dp.Container<RadioModel, HTMLDivElement> = dp.define(
      'div', null,
      dp.define('input', { 'name': 'age', 'value': 10, 'type': 'RADIO', 'value-type': 'number', 'id': '10' }),
      dp.define('input', { 'name': 'age', 'value': 20, 'type': 'RADIO', 'value-type': 'number', 'id': '20' })
    );

    component.setData({ age: 20 });

    var radio10 = component.queryById<dp.Container<string, HTMLInputElement>>('10').domNode;
    var radio20 = component.queryById<dp.Container<number, HTMLInputElement>>('20').domNode;

    expect(radio10.checked).toBe(false);
    expect(radio20.checked).toBe(true);

    radio10.checked = true;

    expect(component.getData()).toEqual({ age: 10 });
  });

  it('Check select with array', () => {
    function generator(model: { id: string, text: string }) {
      return dp.define('option', { value: model.id }, model.text);
    }

    var component: dp.Container<TypeModel, HTMLDivElement> = dp.define(
      'div', null,
      dp.define(
        'select', { 'name': 'type', 'value-type': 'string' },
        dp.List({ generator, id: 'list' })),
      dp.define('input', { 'name': 'name', 'value-type': 'string' })
    );

    component.queryById<dp.ListContainer<any>>('list').setData([{ id: 'a', text: '_a' }, { id: 'b', text: '_b' }]);
    component.setData({ name: 'text_name', type: 'a' });

    var typeSelect = component.queryByName<dp.Component<string, HTMLSelectElement>>('type')[0].domNode;
    var nameInput = component.queryByName<dp.Component<string, HTMLInputElement>>('name')[0].domNode;

    expect(typeSelect.value).toBe('a');
    expect(nameInput.value).toBe('text_name');

    nameInput.value = 'test test';
    typeSelect.options.item(1).selected = true;

    expect(component.getData()).toEqual({ name: 'test test', type: 'b' });
  });

  it('Check observer', (done) => {
    var component: dp.Container<TestModel, HTMLDivElement> = dp.define(
      'div', null,
      dp.define('button', { id: 'button_1', onclick: { eventType: 'EVENT', emitter: () => 'PAYLOAD_1' } }),
      dp.define('button', { id: 'button_2', onclick: { eventType: 'EVENT', emitter: () => 'PAYLOAD_2' } })
    );

    var observable = Observable.from(component.createObservable<string>('EVENT'));
    var count = 0;

    var subscription = observable.subscribe(({ payload }) => {
      count++;

      expect(payload).toBe(count === 1 ? 'PAYLOAD_1' : 'PAYLOAD_2');

      if (count > 1) {
        subscription.unsubscribe();
        done();
      }
    });

    component.queryById<dp.Component<any, HTMLButtonElement>>('button_1').domNode.click();
    component.queryById<dp.Component<any, HTMLButtonElement>>('button_2').domNode.click();
  });

  it('Check observer when modifying structure', (done) => {
    var component: dp.Container<TestModel, HTMLDivElement> = dp.define(
      'div', null,
      dp.define('button', { id: 'button_1', onclick: { eventType: 'EVENT', emitter: () => 'PAYLOAD_1' } })
    );

    var observable = Observable.from(component.createObservable<string>('EVENT'));

    var subscription = observable.subscribe(({ payload }) => {
      expect(payload).toBe('PAYLOAD_2');

      subscription.unsubscribe();
      done();
    });

    const child1 = component.queryById<dp.Component<any, HTMLButtonElement>>('button_1');
    var child2 = dp.define<dp.Component<any, HTMLButtonElement>>(
      'button',
      { id: 'button_2', onclick: { eventType: 'EVENT', emitter: () => 'PAYLOAD_2' } }
    );

    component.remove(child1);
    component.append(child2);

    child1.domNode.click();
    child2.domNode.click();
  });

  it('Check model payload', (done) => {
    var component: dp.Container<TestModel, HTMLDivElement> = dp.define(
      'div', null,
      dp.define('input', { 'name': 'name', 'value-type': 'string' }),
      dp.define('input', { 'name': 'age', 'value-type': 'number' }),
      dp.define<dp.Component<any, HTMLButtonElement>>(
        'button',
        { id: 'button', onclick: { eventType: 'EVENT' } }
      )
    );

    component.setData({ name: 'test', age: 123 });

    var observable = Observable.from(component.createObservable<string>('EVENT'));

    var subscription = observable.subscribe(({ payload }) => {
      expect(payload).toEqual({ name: 'test', age: 123 });
      done();
    });

    component.queryById<dp.Component<any, HTMLButtonElement>>('button').domNode.click();
  });

});
import { JSDOM } from 'jsdom';
import * as Observable from 'zen-observable';

import { DomBinder } from '../src/component/dom/DomBinder';
import { dp } from '../src/dp';

const dom = new JSDOM(`<!DOCTYPE html><p>test</p>`);

// tslint:disable-next-line:no-string-literal
global['document'] = dom.window.document;

const intBinder = { set: (n) => `${n}`, get: (v) => parseInt(v) };

describe('Definition of simple HTML components with bound data', () => {

  it('checks html', () => {
    const div: dp.Component<number, HTMLDivElement> = dp.define(
      'div', { name: 'val', bind: intBinder },
      '321'
    );

    expect(div.getData()).toBe(321);

    div.setData(123);

    expect(div.domNode.textContent).toBe('123');
  });

  it('checks html', () => {
    const div: dp.Component<number, HTMLDivElement> = dp.define(
      'div', { name: 'val', bind: intBinder },
      321
    );

    expect(div.getData()).toBe(321);

    div.setData(123);

    expect(div.domNode.textContent).toBe('123');
  });

  it('checks input', () => {
    const input: dp.Component<number, HTMLInputElement> = dp.define(
      'input',
      { name: 'val', bind: intBinder }
    );
    const nativeInput = input.domNode;

    input.setData(123);

    expect(nativeInput.value).toBe('123');

    nativeInput.value = '456';

    expect(input.getData()).toBe(456);
  });

});

interface TestModel {
  name: string;
  age: number;
}

describe('Definition of containers', () => {

  interface TypeModel {
    type: string;
    name: string;
  }

  interface RadioModel {
    age: number;
  }

  it('checks model', () => {
    const component: dp.Container<TestModel, HTMLDivElement> = dp.define(
      'div', null,
      dp.define('input', { name: 'name', bind: DomBinder.IDENTITY_BINDER }),
      dp.define('input', { name: 'age', bind: intBinder })
    );

    component.setData({ name: 'test', age: 123 });

    const nameInput = component.queryByName<dp.Container<string, HTMLInputElement>>('name')[0].domNode;
    const ageInput = component.queryByName<dp.Container<number, HTMLInputElement>>('age')[0].domNode;

    expect(nameInput.value).toBe('test');
    expect(ageInput.value).toBe('123');

    nameInput.value = 'test test';
    ageInput.value = '456';

    expect(component.getData()).toEqual({ name: 'test test', age: 456 });
  });

  it('checks model of group container', () => {
    const component: dp.Container<TestModel, HTMLDivElement> = dp.define(
      'div', null,
      dp.define(dp.Group, null,
        dp.define('input', { name: 'name', bind: DomBinder.IDENTITY_BINDER }),
        dp.define('input', { name: 'age', bind: intBinder })
      )
    );

    component.setData({ name: 'test', age: 123 });

    const nameInput = component.queryByName<dp.Container<string, HTMLInputElement>>('name')[0].domNode;
    const ageInput = component.queryByName<dp.Container<number, HTMLInputElement>>('age')[0].domNode;

    expect(nameInput.value).toBe('test');
    expect(ageInput.value).toBe('123');

    nameInput.value = 'test test';
    ageInput.value = '456';

    expect(component.getData()).toEqual({ name: 'test test', age: 456 });
  });

  it('checks radio group', () => {
    const component: dp.Container<RadioModel, HTMLDivElement> = dp.define(
      'div', null,
      dp.define('input', { name: 'age', value: 10, type: 'RADIO', bind: intBinder, id: '10' }),
      dp.define('input', { name: 'age', value: 20, type: 'RADIO', bind: intBinder, id: '20' })
    );

    component.setData({ age: 20 });

    const radio10 = component.queryById<dp.Container<string, HTMLInputElement>>('10').domNode;
    const radio20 = component.queryById<dp.Container<number, HTMLInputElement>>('20').domNode;

    expect(radio10.checked).toBe(false);
    expect(radio20.checked).toBe(true);

    radio10.checked = true;

    expect(component.getData()).toEqual({ age: 10 });
  });

  it('checks select with array', () => {
    function generator(model: { id: string, text: string }) {
      return dp.define('option', { value: model.id }, model.text);
    }

    const component: dp.Container<TypeModel, HTMLDivElement> = dp.define(
      'div', null,
      dp.define(
        'select', { name: 'type', bind: DomBinder.IDENTITY_BINDER },
        dp.List({ generator, id: 'list' })),
      dp.define('input', { name: 'name', bind: DomBinder.IDENTITY_BINDER })
    );

    component.queryById<dp.ListContainer<any>>('list').setData([{ id: 'a', text: '_a' }, { id: 'b', text: '_b' }]);
    component.setData({ name: 'text_name', type: 'a' });

    const typeSelect = component.queryByName<dp.Component<string, HTMLSelectElement>>('type')[0].domNode;
    const nameInput = component.queryByName<dp.Component<string, HTMLInputElement>>('name')[0].domNode;

    expect(typeSelect.value).toBe('a');
    expect(nameInput.value).toBe('text_name');

    nameInput.value = 'test test';
    typeSelect.options.item(1).selected = true;

    expect(component.getData()).toEqual({ name: 'test test', type: 'b' });
  });

});

describe('Observer', () => {

  it('checks observer', (done) => {
    const component: dp.Container<TestModel, HTMLDivElement> = dp.define(
      'div', null,
      dp.define('button', { id: 'button_1', onclick: { eventType: 'EVENT', emitter: () => 'PAYLOAD_1' } }),
      dp.define('button', { id: 'button_2', onclick: { eventType: 'EVENT', emitter: () => 'PAYLOAD_2' } })
    );

    const observable = Observable.from(component.createObservable<string>('EVENT'));
    var count = 0;

    const subscription = observable.subscribe(({ payload }) => {
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

  it('checks observer when modifying structure', (done) => {
    const component: dp.Container<TestModel, HTMLDivElement> = dp.define(
      'div', null,
      dp.define('button', { id: 'button_1', onclick: { eventType: 'EVENT', emitter: () => 'PAYLOAD_1' } })
    );

    const observable = Observable.from(component.createObservable<string>('EVENT'));

    const subscription = observable.subscribe(({ payload }) => {
      expect(payload).toBe('PAYLOAD_2');

      subscription.unsubscribe();
      done();
    });

    const child1 = component.queryById<dp.Component<any, HTMLButtonElement>>('button_1');
    const child2 = dp.define<dp.Component<any, HTMLButtonElement>>(
      'button',
      { id: 'button_2', onclick: { eventType: 'EVENT', emitter: () => 'PAYLOAD_2' } }
    );

    component.remove(child1);
    component.append(child2);

    child1.domNode.click();
    child2.domNode.click();
  });

  it('checks model payload', (done) => {
    const component: dp.Container<TestModel, HTMLDivElement> = dp.define(
      'div', null,
      dp.define('input', { name: 'name', bind: DomBinder.IDENTITY_BINDER }),
      dp.define('input', { name: 'age', bind: intBinder }),
      dp.define<dp.Component<any, HTMLButtonElement>>(
        'button',
        { id: 'button', onclick: { eventType: 'EVENT' } }
      )
    );

    component.setData({ name: 'test', age: 123 });

    const observable = Observable.from(component.createObservable<string>('EVENT'));

    const subscription = observable.subscribe(({ payload }) => {
      expect(payload).toEqual({ name: 'test', age: 123 });
      done();
    });

    component.queryById<dp.Component<any, HTMLButtonElement>>('button').domNode.click();
  });

});

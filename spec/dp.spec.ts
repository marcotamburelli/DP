import { JSDOM } from 'jsdom';
import * as Observable from 'zen-observable';

import { DataDrivenComponent } from '../src/component/BaseComponent';
import { DomBinder } from '../src/component/dom/DomBinder';
import { dp } from '../src/dp';
import { CustomComponent } from '../src/generator/CustomComponent';
import { Properties } from '../src/util/types';

const dom = new JSDOM(`<!DOCTYPE html><p>test</p>`);

// tslint:disable-next-line:no-string-literal
global['document'] = dom.window.document;

describe('Definition of simple HTML components with bound data', () => {

  it('checks html', () => {
    const div: dp.Component<number, HTMLDivElement> = dp.define(
      'div', { name: 'val', bind: DomBinder.INT_BINDER },
      '321'
    );

    expect(div.getData()).toBe(321);

    div.setData(123);

    expect(div.domNode.textContent).toBe('123');
  });

  it('checks html', () => {
    const div: dp.Component<number, HTMLDivElement> = dp.define(
      'div', { name: 'val', bind: DomBinder.INT_BINDER },
      321
    );

    expect(div.getData()).toBe(321);

    div.setData(123);

    expect(div.domNode.textContent).toBe('123');
  });

  it('checks input', () => {
    const input: dp.Component<number, HTMLInputElement> = dp.define(
      'input',
      { name: 'val', bind: DomBinder.INT_BINDER }
    );
    const nativeInput = input.domNode;

    input.setData(123);

    expect(nativeInput.value).toBe('123');

    nativeInput.value = '456';

    expect(input.getData()).toBe(456);
  });

});

interface TestData {
  name?: string;
  age?: number;
}

interface TestDataForList extends TestData {
  id: string;
}

describe('Definition of containers', () => {

  interface TypeData {
    type: string;
    name: string;
  }

  interface RadioData {
    age: number;
  }

  interface PropertyData {
    id: string;
    name: {
      align: string
    };
  }

  it('checks data', () => {
    const component: dp.Container<TestData, HTMLDivElement> = dp.define(
      'div', null,
      dp.define('input', { name: 'name', bind: DomBinder.IDENTITY_BINDER }),
      dp.define('input', { name: 'age', bind: DomBinder.INT_BINDER })
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

  it('checks null with int binder', () => {
    const component: dp.Container<TestData, HTMLDivElement> = dp.define(
      'div', null,
      dp.define('input', { name: 'name', bind: DomBinder.IDENTITY_BINDER }),
      dp.define('input', { name: 'age', bind: DomBinder.INT_BINDER })
    );

    component.setData({ name: 'test' });

    const ageInput = component.queryByName<dp.Container<number, HTMLInputElement>>('age')[0].domNode;

    expect(ageInput.value).toBe('');

    component.setData({ name: 'test', age: null });

    expect(ageInput.value).toBe('');

    ageInput.value = 'xxx';

    expect(component.getData()).toEqual({ name: 'test', age: NaN });
  });

  it('checks data with properties', () => {
    const component: dp.Container<{ align: string }, HTMLDivElement> = dp.define(
      'div', null,
      dp.define('div', { align: DomBinder.IDENTITY_BINDER, id: 'div' })
    );

    component.setData({ align: 'left' });

    const div = component.queryById<dp.Container<string, HTMLDivElement>>('div').domNode;

    expect(div.align).toBe('left');

    div.align = 'right';

    expect(component.getData()).toEqual({ align: 'right' });
  });

  it('checks data with more properties', () => {
    const component: dp.Container<PropertyData, HTMLDivElement> = dp.define(
      'div', { id: DomBinder.IDENTITY_BINDER },
      dp.define('div', { name: 'name', align: DomBinder.IDENTITY_BINDER, id: 'div' })
    );

    component.setData({ id: '#1', name: { align: 'left' } });

    const container = component.domNode;
    const child = component.queryById<dp.Container<string, HTMLDivElement>>('div').domNode;

    expect(container.id).toBe('#1');
    expect(child.align).toBe('left');

    container.id = '#2';
    child.align = 'right';

    expect(component.getData()).toEqual({ id: '#2', name: { align: 'right' } });
  });

  it('checks data of group container', () => {
    const component: dp.Container<TestData, HTMLDivElement> = dp.define(
      'div', null,
      dp.define(dp.Group, null,
        dp.define('input', { name: 'name', bind: DomBinder.IDENTITY_BINDER }),
        dp.define('input', { name: 'age', bind: DomBinder.INT_BINDER })
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
    const component: dp.Container<RadioData, HTMLDivElement> = dp.define(
      'div', null,
      dp.define('input', { name: 'age', value: 10, type: 'RADIO', bind: DomBinder.INT_BINDER, id: '10' }),
      dp.define('input', { name: 'age', value: 20, type: 'RADIO', bind: DomBinder.INT_BINDER, id: '20' })
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
    const component: dp.Container<TypeData, HTMLDivElement> = dp.define(
      'div', null,
      dp.define(
        'select', { name: 'type', bind: DomBinder.IDENTITY_BINDER },
        dp.define(dp.List, { id: 'list' },
          dp.define('option', { value: DomBinder.IDENTITY_BINDER },
            dp.define(dp.Text, { name: 'text' })
          )
        )
      ),
      dp.define('input', { name: 'name', bind: DomBinder.IDENTITY_BINDER })
    );

    const list = component.queryById<dp.ListContainer<any>>('list');
    list.setData([{ value: 'a', text: '_a' }, { value: 'b', text: '_b' }]);
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
    const component: dp.Container<TestData, HTMLDivElement> = dp.define(
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
    const component: dp.Container<TestData, HTMLDivElement> = dp.define(
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

  it('checks data payload', (done) => {
    const component: dp.Container<TestData, HTMLDivElement> = dp.define(
      'div', null,
      dp.define('input', { name: 'name', bind: DomBinder.IDENTITY_BINDER }),
      dp.define('input', { name: 'age', bind: DomBinder.INT_BINDER }),
      dp.define<dp.Component<any, HTMLButtonElement>>(
        'button',
        { id: 'button', onclick: dp.DATA_EMITTER() }
      )
    );

    const observable = Observable.from(component.createObservable<string>(dp.DATA_EVENT));

    const subscription = observable.subscribe(({ payload }) => {
      expect(payload).toEqual({ name: 'test', age: 123 });
      done();
    });

    component.setData({ name: 'test', age: 123 });
    component.queryById<dp.Component<any, HTMLButtonElement>>('button').domNode.click();
  });

});

describe('Payload emitter in nested scopes', () => {

  it('checks payload in named container', (done) => {
    const component: dp.Container<{ data: TestData }, HTMLDivElement> = dp.define(
      'div', null,
      dp.define(dp.Group, { name: 'data' },
        dp.define(dp.Group, { id: 'inner' },
          dp.define('input', { name: 'name', bind: DomBinder.IDENTITY_BINDER }),
          dp.define('input', { name: 'age', bind: DomBinder.INT_BINDER }),
          dp.define<dp.Component<any, HTMLButtonElement>>(
            'button',
            { id: 'button', onclick: dp.DATA_EMITTER() }
          )
        )
      )
    );

    const observable = Observable.from(component.createObservable<string>(dp.DATA_EVENT));

    const subscription = observable.subscribe(({ payload }) => {
      expect(payload).toEqual({ name: 'test', age: 123 });
      done();
    });

    component.setData({ data: { name: 'test', age: 123 } });
    component.queryById<dp.Component<null, HTMLButtonElement>>('button').domNode.click();
  });

  it('checks payload in named group', (done) => {
    const component: dp.Container<{ data: TestData }, HTMLDivElement> = dp.define(
      'div', null,
      dp.define('div', { name: 'data' },
        dp.define('div', { id: 'inner' },
          dp.define('input', { name: 'name', bind: DomBinder.IDENTITY_BINDER }),
          dp.define('input', { name: 'age', bind: DomBinder.INT_BINDER }),
          dp.define<dp.Component<any, HTMLButtonElement>>(
            'button',
            { id: 'button', onclick: dp.DATA_EMITTER() }
          )
        )
      )
    );

    const observable = Observable.from(component.createObservable<string>(dp.DATA_EVENT));

    const subscription = observable.subscribe(({ payload }) => {
      expect(payload).toEqual({ name: 'test', age: 123 });
      done();
    });

    component.setData({ data: { name: 'test', age: 123 } });
    component.queryById<dp.Component<null, HTMLButtonElement>>('button').domNode.click();
  });

  it('checks payload in list item', (done) => {
    const component: dp.Container<{ data: TestDataForList[] }, HTMLDivElement> = dp.define(
      'div', null,
      dp.define(dp.List, { name: 'data' },
        dp.define('div', null,
          dp.define('input', { name: 'name', bind: DomBinder.IDENTITY_BINDER }),
          dp.define('input', { name: 'age', bind: DomBinder.INT_BINDER }),
          dp.define<dp.Component<any, HTMLButtonElement>>(
            'button',
            { id: DomBinder.IDENTITY_BINDER, onclick: dp.DATA_EMITTER() }
          )
        )
      )
    );

    const observable = Observable.from(component.createObservable<string>(dp.DATA_EVENT));

    const subscription = observable.subscribe(({ payload }) => {
      expect(payload).toEqual({ name: 'test', age: 123, id: 'button' });
      done();
    });

    component.setData({ data: [{ name: 'test', age: 123, id: 'button' }] });
    component.queryById<dp.Component<null, HTMLButtonElement>>('button').domNode.click();
  });

  it('checks in generated list item', (done) => {
    const Generate = () => {
      const child: dp.Component<TestDataForList, HTMLButtonElement> = dp.define('div', null,
        dp.define('input', { name: 'name', bind: DomBinder.IDENTITY_BINDER }),
        dp.define('input', { name: 'age', bind: DomBinder.INT_BINDER }),
        dp.define<dp.Component<any, HTMLButtonElement>>(
          'button',
          { id: DomBinder.IDENTITY_BINDER, onclick: { eventType: dp.DATA_EVENT, emitter: () => child.getData() } }
        )
      );

      return child;
    };

    const component: dp.Container<{ data: TestDataForList[] }, HTMLDivElement> = dp.define(
      'div', null,
      dp.define(dp.List, { name: 'data' },
        dp.define(Generate, null)
      )
    );

    const observable = Observable.from(component.createObservable<string>(dp.DATA_EVENT));

    const subscription = observable.subscribe(({ payload }) => {
      expect(payload).toEqual({ name: 'test', age: 123, id: 'button' });
      done();
    });

    component.setData({ data: [{ name: 'test', age: 123, id: 'button' }] });
    component.queryById<dp.Component<null, HTMLButtonElement>>('button').domNode.click();
  });

});

describe('Function Component', () => {
  interface TestEditorModel { id: number; title: string; }

  function Element() {
    const element: dp.Component<TestEditorModel, HTMLLIElement> = dp.define('li', {
      id: { set: (id) => 'item-' + id, get: (str) => parseInt(str.split('-')[1]) }
    }, dp.define(dp.Text, { name: 'title' }));

    return element;
  }

  function Editor({ id, name }) {
    const editor: dp.Component<TestEditorModel, HTMLDivElement> = dp.define('div', { id, name },
      dp.define('div', { name: 'id', bind: dp.INT_BINDER }),
      dp.define('form', null,
        dp.define('div', null,
          dp.define('input', { name: 'title', type: 'text' })
        )
      )
    );

    return editor;
  }

  it('builds HTML structure', () => {
    const editor1 = dp.define(Editor, { name: 'editor', id: 'editor' });
    const editor2 = dp.define(Editor, { id: 'editor' });

    const component1: dp.Container<{ editor: TestEditorModel }, HTMLDivElement> = dp.define(
      'div', null,
      editor1
    );
    const component2: dp.Container<{ editor: TestEditorModel }, HTMLDivElement> = dp.define(
      'div', null,
      dp.define(
        'div', { name: 'editor' },
        editor2
      )
    );

    component1.setData({ editor: { id: 1, title: 'default 1' } });
    component2.setData({ editor: { id: 1, title: 'default 1' } });

    expect(component1.getData()).toEqual({ editor: { id: 1, title: 'default 1' } });
    expect(component2.getData()).toEqual({ editor: { id: 1, title: 'default 1' } });
  });

  it('builds List structure', () => {
    const component: dp.Container<{ items: TestEditorModel[] }, HTMLDivElement> = dp.define(
      'div', null,
      dp.define(dp.List, { name: 'items' },
        dp.define(Element, null)
      )
    );

    component.setData({ items: [{ id: 1, title: 'default 1' }, { id: 2, title: 'default 2' }] });

    expect(component.getData()).toEqual({ items: [{ id: 1, title: 'default 1' }, { id: 2, title: 'default 2' }] });
  });
});

describe('Custom Component', () => {
  class MyCustom extends CustomComponent<TestData, HTMLDivElement> {
    protected generateComponent(properties: Properties): DataDrivenComponent<TestData, HTMLDivElement> {
      const component: dp.Container<TestData, HTMLDivElement> = dp.define(
        'div', { id: `${properties.id}.div`, align: properties.align },
        dp.define('input', { name: 'name', bind: DomBinder.IDENTITY_BINDER }),
        dp.define('input', { name: 'age', bind: DomBinder.INT_BINDER })
      );

      return component;
    }
  }

  it('checks structure', () => {
    const component: dp.Container<TestData, HTMLDivElement> = dp.define(
      'div', { id: 'parent' },
      dp.define(MyCustom as { new(): MyCustom }, { id: 'custom', align: 'left' })
    );

    const custom = component.queryById<dp.Container<TestData, HTMLDivElement>>('custom.div');
    const customDom = custom.domNode;

    expect(customDom.align).toBe('left');
    expect(customDom.childNodes.length).toBe(2);
  });

  it('checks data', () => {
    const component: dp.Container<TestData, HTMLDivElement> = dp.define(
      'div', { id: 'parent' },
      dp.define(MyCustom as { new(): MyCustom }, { id: 'custom' })
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

  it('checks clone', () => {
    const component: dp.Container<TestData, HTMLDivElement> = dp.define(
      'div', { id: 'parent' },
      dp.define(MyCustom as { new(): MyCustom }, { id: 'custom' })
    );

    const clone = component.cloneComponent(true);
    const divList = clone.domNode.getElementsByTagName('div');

    expect(divList.length).toBe(1);
  });

});

import { JSDOM } from 'jsdom';

import { Container } from '../../src/component/Container';
import { HtmlElementComponent } from '../../src/component/HtmlComponents';
import { ListContainer } from '../../src/component/ListContainer';

const dom = new JSDOM(`<!DOCTYPE html><p>test</p>`);

// tslint:disable-next-line:no-string-literal
global['document'] = dom.window.document;

describe('Checking Array', () => {

  function flatGenerator(model: { val: string }, idx: number) {
    const div = document.createElement('div');

    return new HtmlElementComponent(div, { id: `${idx}`, name: 'val' }, (value) => value);
  }

  function propertiesGenerator(model: { val: string }, idx: number) {
    const element = document.createElement('div');
    const controlElement = document.createElement('div');

    const container = new Container(element, { namespace: 'element' });
    const child = new HtmlElementComponent(controlElement, { id: `${idx}`, name: 'val' }, (value) => value);

    container.append(child);

    return container;
  }

  function contextlessGen(idx: number) {
    const div = document.createElement('div');

    div.id = `id-${idx}`;
    div.innerText = `div-${idx}`;

    return new HtmlElementComponent(div, {}, (value) => value);
  }

  it('Append HTML children', () => {
    const div = document.createElement('div');

    const root = new HtmlElementComponent(div);
    const array = new ListContainer<any>(propertiesGenerator, { namespace: 'namespace', name: 'values' });

    const child1 = contextlessGen(0);
    const child2 = contextlessGen(1);

    root.append(array);

    array.append(child1);
    array.append(child2);

    expect(div.querySelector<HTMLDivElement>('#id-0').innerText).toBe('div-0');
    expect(div.querySelector<HTMLDivElement>('#id-1').innerText).toBe('div-1');

    child1.detach();

    expect(div.querySelector<HTMLDivElement>('#id-0')).toBeNull();
    expect(array.queryByIdx(0)).toBe(child2);
    expect(array.queryByIdx(1)).toBeUndefined();
  });

  it('Checking model', () => {
    const div = document.createElement('div');

    const root = new HtmlElementComponent(div);
    const array = new ListContainer<any>(propertiesGenerator, { namespace: 'namespace', name: 'values' });

    const child1 = propertiesGenerator(null, 0);
    const child2 = propertiesGenerator(null, 1);

    child1.setModel({ val: 'value_1' });
    child2.setModel({ val: 'value_2' });

    root.append(array);

    array.append(child1);
    array.append(child2);

    expect(array.getModel()).toEqual([{ val: 'value_1' }, { val: 'value_2' }]);

    child1.detach();

    expect(array.getModel()).toEqual([{ val: 'value_2' }]);
  });

  it('Checking building', () => {
    const div = document.createElement('div');

    const root = new HtmlElementComponent(div);
    const array = new ListContainer<any>(flatGenerator, { namespace: 'namespace', name: 'values' });

    root.append(array);

    array.setModel(['value_1', 'value_2']);

    expect(array.getModel()).toEqual(['value_1', 'value_2']);
  });

  it('Checking building complex structure', () => {
    const div = document.createElement('div');

    const root = new Container(div, { namespace: 'root' });
    const array = new ListContainer<any>(flatGenerator, { namespace: 'namespace', name: 'values' });

    root.append(array);
    root.setModel({ values: ['value_1', 'value_2'] });

    expect(root.getModel()).toEqual({ values: ['value_1', 'value_2'] });
  });

  it('Checking building with container generator', () => {
    const div = document.createElement('div');

    const root = new HtmlElementComponent(div);
    const array = new ListContainer<any>(propertiesGenerator, { namespace: 'namespace', name: 'values' });

    root.append(array);

    array.setModel([{ val: 'value_1' }, { val: 'value_2' }]);

    expect(array.getModel()).toEqual([{ val: 'value_1' }, { val: 'value_2' }]);
  });

});

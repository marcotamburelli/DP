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

    const container = new Container(element);
    const child = new HtmlElementComponent(controlElement, { id: `${idx}`, name: 'val' }, (value) => value);

    container.append(child);

    return container;
  }

  function contextlessGen(idx: number) {
    const div = document.createElement('div');

    div.id = `id-${idx}`;
    div.textContent = `div-${idx}`;

    return new HtmlElementComponent(div, {}, (value) => value);
  }

  it('Append HTML children', () => {
    const div = document.createElement('div');

    const root = new HtmlElementComponent(div);
    const array = new ListContainer<any>(propertiesGenerator, { name: 'values' });

    const child1 = contextlessGen(0);
    const child2 = contextlessGen(1);

    root.append(array);

    array.append(child1);
    array.append(child2);

    expect(div.querySelector<HTMLDivElement>('#id-0').textContent).toBe('div-0');
    expect(div.querySelector<HTMLDivElement>('#id-1').textContent).toBe('div-1');

    array.remove(child1);

    expect(div.querySelector<HTMLDivElement>('#id-0')).toBeNull();
    expect(array.queryByIdx(0)).toBe(child2);
    expect(array.queryByIdx(1)).toBeUndefined();
  });

  it('Checking model', () => {
    const div = document.createElement('div');

    const root = new HtmlElementComponent(div);
    const array = new ListContainer<any>(propertiesGenerator, { name: 'values' });

    const child1 = propertiesGenerator(null, 0);
    const child2 = propertiesGenerator(null, 1);

    child1.setData({ val: 'value_1' });
    child2.setData({ val: 'value_2' });

    root.append(array);

    array.append(child1);
    array.append(child2);

    expect(array.getData()).toEqual([{ val: 'value_1' }, { val: 'value_2' }]);

    array.remove(child1);

    expect(array.getData()).toEqual([{ val: 'value_2' }]);
  });

  it('Checking building', () => {
    const div = document.createElement('div');

    const root = new HtmlElementComponent(div);
    const array = new ListContainer<any>(flatGenerator, { name: 'values' });

    root.append(array);

    array.setData(['value_1', 'value_2']);

    expect(array.getData()).toEqual(['value_1', 'value_2']);
  });

  it('Checking building complex structure', () => {
    const div = document.createElement('div');

    const root = new Container(div);
    const array = new ListContainer<any>(flatGenerator, { name: 'values' });

    root.append(array);
    root.setData({ values: ['value_1', 'value_2'] });

    expect(root.getData()).toEqual({ values: ['value_1', 'value_2'] });
  });

  it('Checking building with container generator', () => {
    const div = document.createElement('div');

    const root = new HtmlElementComponent(div);
    const array = new ListContainer<any>(propertiesGenerator, { name: 'values' });

    root.append(array);

    array.setData([{ val: 'value_1' }, { val: 'value_2' }]);

    expect(array.getData()).toEqual([{ val: 'value_1' }, { val: 'value_2' }]);
  });

});

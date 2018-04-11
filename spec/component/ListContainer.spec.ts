import { JSDOM } from 'jsdom';

import { Container } from '../../src/component/Container';
import { HtmlElementComponent } from '../../src/component/HtmlComponents';
import { ListContainer } from '../../src/component/ListContainer';

const dom = new JSDOM(`<!DOCTYPE html><p>test</p>`);

// tslint:disable-next-line:no-string-literal
global['document'] = dom.window.document;

describe('Data from List (no generator)', () => {

  function createHtml(idx: number) {
    const div = document.createElement('div');

    div.id = `${idx}`;

    return new HtmlElementComponent<string>(div, { name: 'val' }, {});
  }

  function createContainer(idx: number) {
    const element = document.createElement('div');
    const controlElement = document.createElement('div');

    controlElement.id = `${idx}`;

    const container = new Container<{ val: string }, HTMLDivElement>(element);
    const child = new HtmlElementComponent<string>(controlElement, { name: 'val' }, {});

    container.append(child);

    return container;
  }

  function createNoContextHtml(idx: number) {
    const div = document.createElement('div');

    div.id = `id-${idx}`;
    div.textContent = `div-${idx}`;

    return new HtmlElementComponent(div, {}, {});
  }

  it('checks appending children', () => {
    const div = document.createElement('div');

    const root = new HtmlElementComponent(div);
    const array = new ListContainer<any>(null, { name: 'values' });

    const child1 = createNoContextHtml(0);
    const child2 = createNoContextHtml(1);

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

  it('checks query children by id', () => {
    const div = document.createElement('div');

    const root = new Container(div);
    const array = new ListContainer<any>(null, { name: 'values' });

    const child1 = createHtml(0);
    const child2 = createHtml(1);

    root.append(array);

    array.append(child1);
    array.append(child2);

    expect(root.queryById<HtmlElementComponent<string>>('0')).toBe(child1);
    expect(root.queryById<HtmlElementComponent<string>>('1')).toBe(child2);
  });

  it('checks data retrieving', () => {
    const div = document.createElement('div');

    const root = new HtmlElementComponent(div);
    const array = new ListContainer<any>(null, { name: 'values' });

    const child1 = createContainer(0);
    const child2 = createContainer(1);

    child1.setData({ val: 'value_1' });
    child2.setData({ val: 'value_2' });

    root.append(array);

    array.append(child1);
    array.append(child2);

    expect(array.getData()).toEqual([{ val: 'value_1' }, { val: 'value_2' }]);

    array.remove(child1);

    expect(array.getData()).toEqual([{ val: 'value_2' }]);
  });

});

describe('Data to List', () => {

  function flatGenerator() {
    const div = document.createElement('div');

    return new HtmlElementComponent<string>(div, { name: 'val' }, {});
  }

  function propertiesGenerator() {
    const element = document.createElement('div');
    const controlElement = document.createElement('div');

    const container = new Container<{ val: string }, HTMLDivElement>(element);
    const child = new HtmlElementComponent<string>(controlElement, { name: 'val' }, {});

    container.append(child);

    return container;
  }

  it('checks building from string array', () => {
    const div = document.createElement('div');

    const root = new HtmlElementComponent(div);
    const array = new ListContainer<any>(flatGenerator, { name: 'values' });

    root.append(array);

    array.setData(['value_1', 'value_2']);

    expect(array.getData()).toEqual(['value_1', 'value_2']);
  });

  it('checks building from string array inside container', () => {
    const div = document.createElement('div');

    const root = new Container(div);
    const array = new ListContainer<any>(flatGenerator, { name: 'values' });

    root.append(array);

    root.setData({ values: ['value_1', 'value_2'] });

    expect(root.getData()).toEqual({ values: ['value_1', 'value_2'] });
  });

  it('checks building with container generator', () => {
    const div = document.createElement('div');

    const root = new HtmlElementComponent(div);
    const array = new ListContainer<any>(propertiesGenerator, { name: 'values' });

    root.append(array);

    array.setData([{ val: 'value_1' }, { val: 'value_2' }]);

    expect(array.getData()).toEqual([{ val: 'value_1' }, { val: 'value_2' }]);
  });

});

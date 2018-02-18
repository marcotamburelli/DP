import { JSDOM } from 'jsdom';

import { Container } from '../../src/component/Container';
import { HtmlElementComponent } from '../../src/component/HtmlComponents';
import { ListContainer } from '../../src/component/ListContainer';

const dom = new JSDOM(`<!DOCTYPE html><p>test</p>`);

// tslint:disable-next-line:no-string-literal
global['document'] = dom.window.document;

describe('Checking Array', () => {

  function generator(model: { val: string }, idx: number) {
    const div = document.createElement('div');

    return new HtmlElementComponent(div, { id: `${idx}`, name: 'val' }, (value) => value);
  }

  function containerGenerator(model: { val: string }, idx: number) {
    const element = document.createElement('div');
    const controlElement = document.createElement('div');

    const container = new Container(element, { namespace: 'element' });
    const child = new HtmlElementComponent(controlElement, { id: `${idx}`, name: 'val' }, (value) => value);

    container.append(child);

    return container;
  }

  it('Checking model', () => {
    const div = document.createElement('div');

    const root = new HtmlElementComponent(div);
    const array = new ListContainer<any>({ namespace: 'namespace', name: 'values' }, containerGenerator);

    const child1 = containerGenerator(null, 0);
    const child2 = containerGenerator(null, 1);

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
    const array = new ListContainer<any>({ namespace: 'namespace', name: 'values' }, generator);

    root.append(array);

    array.setModel([{ val: 'value_1' }, { val: 'value_2' }]);

    expect(array.getModel()).toEqual([{ val: 'value_1' }, { val: 'value_2' }]);
  });

  it('Checking building with container generator', () => {
    const div = document.createElement('div');

    const root = new HtmlElementComponent(div);
    const array = new ListContainer<any>({ namespace: 'namespace', name: 'values' }, containerGenerator);

    root.append(array);

    array.setModel([{ val: 'value_1' }, { val: 'value_2' }]);

    expect(array.getModel()).toEqual([{ val: 'value_1' }, { val: 'value_2' }]);
  });

});

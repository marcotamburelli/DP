import { JSDOM } from 'jsdom';

import { Container } from '../../src/component/Container';
import { GroupContainer } from '../../src/component/GroupContainer';
import { HtmlElementComponent } from '../../src/component/HtmlComponents';

const dom = new JSDOM(`<!DOCTYPE html><p>test</p>`);

// tslint:disable-next-line:no-string-literal
global['document'] = dom.window.document;

function createSimpleHtml(name: string, id: string) {
  const controlElement = document.createElement('div');

  return new HtmlElementComponent(controlElement, { id, name }, {});
}

describe('Query inside the group', () => {

  it('checks query by id of missing and existing element', () => {
    const element = document.createElement('div');

    const container = new Container(element);
    const group = new GroupContainer({ name: 'obj' });

    container.append(group);
    group.append(createSimpleHtml('name_1', '1'));
    group.append(createSimpleHtml('name_2', '2'));

    expect(container.queryById('')).toBeUndefined();
    expect(container.queryById('1')).toBeDefined();
  });

});

describe('Data in the group', () => {

  it('checks simple properties', () => {
    const element = document.createElement('div');

    const container = new Container(element, { name: 'test' });
    const group = new GroupContainer({ name: 'obj' });

    const control1 = createSimpleHtml('name_1', '1');
    const control2 = createSimpleHtml('name_2', '2');

    container.append(group);
    group.append(control1);
    group.append(control2);

    group.setData({ name_1: 'value_1', name_2: 'value_2' });

    expect(group.getData()).toEqual({ name_1: 'value_1', name_2: 'value_2' });

    group.remove(control2);

    expect(group.getData()).toEqual({ name_1: 'value_1' });
  });

});

describe('Attach to/detach from group ', () => {
  it('checks attach/detach', () => {
    const element = document.createElement('div');

    const container = new Container(element, { name: 'test' });
    const group = new GroupContainer({ name: 'obj' });

    const control1 = createSimpleHtml('name_1', '1');
    const control2 = createSimpleHtml('name_2', '2');

    container.append(group);
    group.append(control1);
    group.append(control2);

    expect(element.childElementCount).toBe(2);
    expect(element.firstElementChild).toBe(control1.domNode);
    expect(element.lastElementChild).toBe(control2.domNode);

    group.remove(control2);

    expect(element.childElementCount).toBe(1);
    expect(element.firstElementChild).toBe(control1.domNode);
    expect(element.lastElementChild).toBe(control1.domNode);

    group.remove(control1);

    expect(element.childElementCount).toBe(0);
  });

});

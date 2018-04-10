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

  it('checks attach/detach to second level group', () => {
    const element = document.createElement('div');

    const container = new Container(element, { name: 'test' });
    const superGroup = new GroupContainer({ name: 'obj1' });
    const group = new GroupContainer({ name: 'obj2' });

    const control1 = createSimpleHtml('name_1', '1');
    const control2 = createSimpleHtml('name_2', '2');

    container.append(superGroup);
    superGroup.append(group);
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

  it('checks attach/reattach group', () => {
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');

    const container1 = new Container(element1, { name: 'test' });
    const container2 = new Container(element2, { name: 'test' });
    const group = new GroupContainer({ name: 'obj' });

    const control1 = createSimpleHtml('name_1', '1');
    const control2 = createSimpleHtml('name_2', '2');

    group.append(control1);
    group.append(control2);

    container1.append(group);

    expect(element1.childElementCount).toBe(2);
    expect(element1.firstElementChild).toBe(control1.domNode);
    expect(element1.lastElementChild).toBe(control2.domNode);

    container1.remove(group);

    expect(element1.childNodes.length).toBe(0);

    container2.append(group);

    expect(element2.childElementCount).toBe(2);
    expect(element2.firstElementChild).toBe(control1.domNode);
    expect(element2.lastElementChild).toBe(control2.domNode);
  });

  it('checks attach/reattach super-group', () => {
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');

    const container1 = new Container(element1, { name: 'test' });
    const container2 = new Container(element2, { name: 'test' });
    const superGroup = new GroupContainer({ name: 'obj1' });
    const group = new GroupContainer({ name: 'obj2' });

    const control1 = createSimpleHtml('name_1', '1');
    const control2 = createSimpleHtml('name_2', '2');

    group.append(control1);
    group.append(control2);

    superGroup.append(group);
    container1.append(superGroup);

    expect(element1.childElementCount).toBe(2);
    expect(element1.firstElementChild).toBe(control1.domNode);
    expect(element1.lastElementChild).toBe(control2.domNode);

    container1.remove(superGroup);

    expect(element1.childNodes.length).toBe(0);

    container2.append(superGroup);

    expect(element2.childElementCount).toBe(2);
    expect(element2.firstElementChild).toBe(control1.domNode);
    expect(element2.lastElementChild).toBe(control2.domNode);
  });

  it('checks attach/reattach second-level group', () => {
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');

    const container1 = new Container(element1, { name: 'test' });
    const superGroup1 = new GroupContainer({ name: 'obj1' });
    const container2 = new Container(element2, { name: 'test' });
    const superGroup2 = new GroupContainer({ name: 'obj1' });
    const group = new GroupContainer({ name: 'obj2' });

    const control1 = createSimpleHtml('name_1', '1');
    const control2 = createSimpleHtml('name_2', '2');

    group.append(control1);
    group.append(control2);

    superGroup1.append(group);
    container1.append(superGroup1);
    container2.append(superGroup2);

    expect(element1.childElementCount).toBe(2);
    expect(element1.firstElementChild).toBe(control1.domNode);
    expect(element1.lastElementChild).toBe(control2.domNode);

    superGroup1.remove(group);

    expect(element1.childNodes.length).toBe(2); /* 2 is the number of expected placeholder comments */

    superGroup2.append(group);

    expect(element2.childElementCount).toBe(2);
    expect(element2.firstElementChild).toBe(control1.domNode);
    expect(element2.lastElementChild).toBe(control2.domNode);
  });

});

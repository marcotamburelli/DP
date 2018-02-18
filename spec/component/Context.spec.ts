import { HasModel } from '../../src/component/Components';
import { Context } from '../../src/component/Context';

describe('Context', () => {

  class HasModelImpl implements HasModel<string> {
    private model: string;

    getModel() {
      return this.model;
    }

    setModel(model: string) {
      this.model = model;
    }
  }

  it('Search in scope', () => {
    const context = new Context('test');

    context.register({ id: '1', name: 'name_1' }, new HasModelImpl());
    context.updateModel({ 'name_1': 'value_1' });

    expect(context.getById('1').getModel()).toBe('value_1');
    expect(context.getByName('name_1').getModel()).toBe('value_1');
  });

  it('Search in sub-scopes', () => {
    const context = new Context('test');
    const childContext = new Context('child');

    context.register({ id: '1', name: 'name_1' }, new HasModelImpl());
    context.updateModel({ 'name_1': 'value_1' });

    childContext.register({ id: '2', name: 'name_2' }, new HasModelImpl());
    childContext.updateModel({ 'name_2': 'value_2' });

    context.pushChildContext(childContext);

    expect(context.getById('2').getModel()).toBe('value_2');
    expect(context.getByName('name_2')).toBeUndefined();
  });

});

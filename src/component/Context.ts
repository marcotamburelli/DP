import { HasModel } from './Components';
import { DomWrapper } from './DomWrappers';

interface NamesMap { [name: string]: HasModel<any>; };
interface IdsMap { [id: string]: HasModel<any>; };

export class Context<E extends Element> {
  private idsMap: IdsMap = {};
  private namesMap: NamesMap = {};
  private childContexts: { [index: string]: Context<any> } = {};

  constructor(public readonly namespace, private domWrapper?: DomWrapper<E>) {
  }

  pushChildContext(context: Context<any>) {
    this.childContexts[context.namespace] = context;
  }

  removeChildContext(namespace: string) {
    delete this.childContexts[namespace];
  }

  getChildContext(namespace: string) {
    return this.childContexts[namespace];
  }

  extractModel<M>() {
    var model = {};

    for (const name in this.namesMap) {
      if (this.namesMap.hasOwnProperty(name)) {
        model[name] = this.namesMap[name].getModel();
      }
    }

    // for (const namespace in this.childContexts) {
    //   if (this.childContexts.hasOwnProperty(namespace)) {
    //     model = { ...model, ...this.childContexts[namespace].extractModel() };
    //   }
    // }

    return model as M;
  }

  updateModel<M>(model: M) {
    for (const name in model) {
      if (model.hasOwnProperty(name)) {
        var hasModel = this.getByName(name);

        hasModel && hasModel.setModel(model[name] as any);
      }
    }
  }

  getById<M, H extends HasModel<M>>(id: string) {
    var hasModel = this.idsMap[id] as H;

    if (hasModel) {
      return hasModel;
    }

    for (const namespace in this.childContexts) {
      if (this.childContexts.hasOwnProperty(namespace)) {
        hasModel = this.childContexts[namespace].getById(id);

        if (hasModel) {
          return hasModel;
        }
      }
    }
  }

  getByName<M, H extends HasModel<M>>(name: string) {
    var hasModel = this.namesMap[name] as H;

    if (hasModel) {
      return hasModel;
    }
  }

  register({ id, name }: { id?: string, name?: string }, hasModel: HasModel<any>) {
    if (id) {
      this.idsMap[id] = hasModel;

      this.domWrapper && this.domWrapper.registerDomId(this.namespace, id);
    }

    if (name) {
      this.namesMap[name] = hasModel;

      this.domWrapper && this.domWrapper.registerDomName(this.namespace, name);
    }
  }

  unregister({ id, name }: { id?: string, name?: string }) {
    if (id) {
      delete this.idsMap[id];
    }

    if (name) {
      delete this.namesMap[name];
    }
  }
}

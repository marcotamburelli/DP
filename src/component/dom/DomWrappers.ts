export interface DomWrapper<N extends Node> {
  parentDomWrapper: DomWrapper<any>;
  readonly domElement?: N;
  id: string;

  appendChild<F extends Node>(child: DomWrapper<F> | string);

  provideParent<P extends Node>(parent: DomWrapper<P>);

  removeChild(child: DomWrapper<any>);

  clone(): DomWrapper<N>;
}

export namespace DomWrappers {
  type ChildDomWrapper<F extends Node> = DomWrapper<F> | string;

  abstract class AbstractDomWrapper<N extends Node> implements DomWrapper<N> {
    parentDomWrapper: DomWrapper<any>;
    abstract id: string;

    constructor(public readonly domElement?: N) {
    }

    abstract appendChild<F extends Node>(child: ChildDomWrapper<F>);

    provideParent<P extends Node>(parent: DomWrapper<P>) {
      this.parentDomWrapper = parent;
    }

    removeChild(child: DomWrapper<any>) {
      if (child instanceof AbstractDomWrapper) {
        child.detach();
      }
    }

    clone() {
      const domCopy = this.domElement && this.domElement.cloneNode() as N;

      return new (this.constructor as { new(domElement?: N): AbstractDomWrapper<N> })(domCopy);
    }

    protected abstract detach();
  }

  export function simple<E extends Element>(element: E): DomWrapper<E> {
    return new SimpleDomWrapper(element);
  }

  export function group(): DomWrapper<Node> {
    return new GroupWrapper();
  }

  export function text(str = ''): DomWrapper<Text> {
    return new TextWrapper(document.createTextNode(str));
  }

  class SimpleDomWrapper<E extends Element> extends AbstractDomWrapper<E> {
    constructor(domElement: E) {
      super(domElement);
    }

    get id() {
      return this.domElement.id;
    }

    set id(id) {
      this.domElement.id = id;
    }

    appendChild<F extends Node>(child: ChildDomWrapper<F>) {
      if (typeof child === 'string') {
        this.domElement.appendChild(document.createTextNode(child));
      } else {
        const childDom = child.domElement;

        childDom && this.domElement.appendChild(childDom);
        child.provideParent(this);
      }
    }

    detach() {
      const { parentNode } = this.domElement;

      if (this.parentDomWrapper && parentNode) {
        parentNode.removeChild(this.domElement);
      }
    }
  }

  const START_PLACEHOLDER = 'START';
  const END_PLACEHOLDER = 'END';

  class GroupWrapper extends AbstractDomWrapper<Node> {
    id: string;

    private startPlaceholder = document.createComment(START_PLACEHOLDER);
    private endPlaceholder = document.createComment(END_PLACEHOLDER);

    private children = new Set<ChildDomWrapper<any>>();

    constructor() {
      super();
    }

    appendChild<F extends Node>(child: ChildDomWrapper<F>) {
      this.children.add(child);

      this.fireAppend(child);
    }

    provideParent<P extends Node>(parent: DomWrapper<P>) {
      super.provideParent(parent);

      if (!this.domParent) {
        return;
      }

      if (parent instanceof GroupWrapper) {
        this.domParent.insertBefore(this.startPlaceholder, parent.endPlaceholder);
        this.domParent.insertBefore(this.endPlaceholder, parent.endPlaceholder);
      } else {
        this.domParent.appendChild(this.startPlaceholder);
        this.domParent.appendChild(this.endPlaceholder);
      }

      this.children.forEach(child => this.fireAppend(child));
    }

    removeChild(child: DomWrapper<any>) {
      this.children.delete(child);

      super.removeChild(child);
    }

    detach() {
      for (
        let child = this.startPlaceholder.nextSibling;
        child !== this.endPlaceholder;
        child = this.startPlaceholder.nextSibling
      ) {
        this.domParent.removeChild(child);
      }

      this.domParent.removeChild(this.startPlaceholder);
      this.domParent.removeChild(this.endPlaceholder);
    }

    private fireAppend<F extends Node>(child: ChildDomWrapper<F>) {
      if (!this.domParent) {
        return;
      }

      if (typeof child === 'string') {
        var childNode: Node = document.createTextNode(child);
      } else {
        childNode = child.domElement;

        child.provideParent(this);
      }

      if (!childNode) {
        return;
      }

      if (this.domParent) {
        this.domParent.insertBefore(childNode, this.endPlaceholder);
      }
    }

    private get domParent(): Node {
      var parentWrapper = this.parentDomWrapper;

      while (parentWrapper) {
        if (parentWrapper.domElement) {
          return parentWrapper.domElement;
        } else {
          parentWrapper = parentWrapper.parentDomWrapper;
        }
      }
    }
  }

  class TextWrapper extends AbstractDomWrapper<Text> {
    id: string;

    constructor(domElement: Text) {
      super(domElement);
    }

    appendChild<F extends Node>(child: ChildDomWrapper<F>) {
    }

    detach() {
      const { parentNode } = this.domElement;

      parentNode && parentNode.removeChild(this.domElement);
    }
  }
}

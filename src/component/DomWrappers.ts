export interface DomWrapper<E extends Node> {
  readonly domElement?: E;

  appendChild<F extends Node>(child: DomWrapper<F> | string);

  provideParent<P extends Node>(parent: DomWrapper<P>);

  detach();

  registerDomId(namespace: string, id: string);

  registerDomName(namespace: string, name: string);
};

export namespace DomWrappers {
  export function simple<E extends Element>(element: E) {
    return new SimpleDomWrapper(element);
  }

  export function input(element: HTMLInputElement | HTMLSelectElement) {
    return new InputDomWrapper(element);
  }

  export function array() {
    return new ArrayWrapper();
  }

  export function text(text = '') {
    return new TextWrapper(document.createTextNode(text));
  }

  class SimpleDomWrapper<E extends Element> implements DomWrapper<E> {
    constructor(public readonly domElement: E) {
    }

    appendChild<F extends Node>(child: string | DomWrapper<F>) {
      if (typeof child === 'string') {
        this.domElement.appendChild(document.createTextNode(child));
      } else {
        const childDom = child.domElement;

        childDom && this.domElement.appendChild(childDom);
        child.provideParent(this);
      }
    }

    provideParent<P extends Node>(parent: DomWrapper<P>) {
    }

    detach() {
      var domParent = this.domElement.parentNode;

      domParent && domParent.removeChild(this.domElement);
    }

    registerDomId(namespace: string, id: string) {
      this.domElement.id = `${namespace}.${id}`;
    }

    registerDomName(namespace: string, name: string) {
    }
  }

  class InputDomWrapper extends SimpleDomWrapper<HTMLInputElement | HTMLSelectElement> {
    constructor(domElement: HTMLInputElement | HTMLSelectElement) {
      super(domElement);
    }

    registerDomName(namespace: string, name: string) {
      this.domElement.name = `${namespace}.${name}`;
    }
  }

  const START_PLACEHOLDER = 'START';
  const END_PLACEHOLDER = 'END';

  class ArrayWrapper implements DomWrapper<Node> {
    private domParent: Node;

    private startPlaceholder = document.createComment(START_PLACEHOLDER);
    private endPlaceholder = document.createComment(END_PLACEHOLDER);

    appendChild<F extends Node>(child: string | DomWrapper<F>) {
      if (!this.domParent) {
        throw new Error('Array requires to be attached to a parent element, in order to add children');
      }

      if (typeof child === 'string') {
        this.domParent.insertBefore(document.createTextNode(child), this.endPlaceholder);
      } else {
        const childDom = child.domElement;

        childDom && this.domParent.insertBefore(childDom, this.endPlaceholder);
        child.provideParent(this);
      }
    }

    provideParent<P extends Node>(parent: DomWrapper<P>) {
      if (parent instanceof ArrayWrapper) {
        this.domParent = parent.domParent;

        this.domParent.insertBefore(this.startPlaceholder, parent.endPlaceholder);
        this.domParent.insertBefore(this.endPlaceholder, parent.endPlaceholder);
      } else {
        this.domParent = parent.domElement;

        this.domParent.appendChild(this.startPlaceholder);
        this.domParent.appendChild(this.endPlaceholder);
      }
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

    registerDomId(namespace: string, id: string) {
    }

    registerDomName(namespace: string, name: string) {
    }
  }

  class TextWrapper implements DomWrapper<Text> {
    constructor(public readonly domElement: Text) {
    }

    appendChild<F extends Node>(child: string | DomWrapper<F>) {
    }

    provideParent<P extends Node>(parent: DomWrapper<P>) {
    }

    detach() {
      var domParent = this.domElement.parentNode;

      domParent && domParent.removeChild(this.domElement);
    }

    registerDomId(namespace: string, id: string) {
    }

    registerDomName(namespace: string, name: string) {
    }
  }
}

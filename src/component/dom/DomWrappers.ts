export interface DomWrapper<N extends Node> {
  readonly domElement?: N;

  appendChild<F extends Node>(child: DomWrapper<F> | string);

  provideParent<P extends Node>(parent: DomWrapper<P>);

  detach();
}

export namespace DomWrappers {
  export function simple<E extends Element>(element: E): DomWrapper<E> {
    return new SimpleDomWrapper(element);
  }

  export function input(
    element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  ): DomWrapper<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
    return new InputDomWrapper(element);
  }

  export function group(): DomWrapper<Node> {
    return new GroupWrapper();
  }

  export function text(str = ''): DomWrapper<Text> {
    return new TextWrapper(document.createTextNode(str));
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
      const domParent = this.domElement.parentNode;

      domParent && domParent.removeChild(this.domElement);
    }
  }

  class InputDomWrapper extends SimpleDomWrapper<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
    constructor(domElement: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
      super(domElement);
    }

    registerDomName(namespace: string, name: string) {
      this.domElement.name = `${namespace}.${name}`;
    }
  }

  const START_PLACEHOLDER = 'START';
  const END_PLACEHOLDER = 'END';

  class GroupWrapper implements DomWrapper<Node> {
    private domParent: Node;

    private startPlaceholder = document.createComment(START_PLACEHOLDER);
    private endPlaceholder = document.createComment(END_PLACEHOLDER);

    private pendingChildNodes: (string | DomWrapper<any>)[] = [];

    appendChild<F extends Node>(child: string | DomWrapper<F>) {
      if (!this.domParent) {
        this.pendingChildNodes.push(child);
      } else {
        this._append(child);
      }
    }

    provideParent<P extends Node>(parent: DomWrapper<P>) {
      if (parent instanceof GroupWrapper) {
        this.domParent = parent.domParent;

        this.domParent.insertBefore(this.startPlaceholder, parent.endPlaceholder);
        this.domParent.insertBefore(this.endPlaceholder, parent.endPlaceholder);
      } else {
        this.domParent = parent.domElement;

        this.domParent.appendChild(this.startPlaceholder);
        this.domParent.appendChild(this.endPlaceholder);
      }

      this.pendingChildNodes.forEach(child => this._append(child));
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

    private _append(child: string | DomWrapper<any>) {
      if (typeof child === 'string') {
        this.domParent.insertBefore(document.createTextNode(child), this.endPlaceholder);
      } else {
        const childDom = child.domElement;

        childDom && this.domParent.insertBefore(childDom, this.endPlaceholder);
        child.provideParent(this);
      }
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
      const domParent = this.domElement.parentNode;

      domParent && domParent.removeChild(this.domElement);
    }
  }
}

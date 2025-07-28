export class Element {
  private _element: HTMLElement;
  private _blockName: string;

  protected constructor({ blockName }: { blockName: string }) {
    this._blockName = blockName;
    this._element = <HTMLElement>document.querySelector(`.${this._blockName}`);
  }

  protected get blockName() {
    return this._blockName;
  }

  protected get element() {
    return this._element;
  }
}

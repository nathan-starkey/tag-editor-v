export default interface Control<T> {
  name: string;

  getElement(): HTMLElement;

  setValue(value: any): void;

  getValue(): T;
}
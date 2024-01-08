export class AgeEditor {
  // gets called once before the renderer is used
  eInput!: HTMLInputElement;

  init(params: any) {
    console.log('init');
    this.eInput = document.createElement('input');
    this.eInput.classList.add('my-custom-editor', 'ag-input-field-input');
    this.eInput.addEventListener('keydown', this.validateEdit);
  }

  validateEdit = (e: any) => {
    if (e.key === 'Tab' || e.key === 'Enter' || e.key === 'Escape') {
      if (!this.validateValue(this.getValue())) {
        this.eInput.classList.add('invalid');
        e.preventDefault();
      }
    }
  }

  validateValue = (value: any) => {
    return value >= 10;
  }

  // gets called once when grid ready to insert the element
  getGui() {
    return this.eInput;
  }

  // focus and select can be done after the gui is attached
  afterGuiAttached() {
    this.eInput.focus();
  }

 isCancelAfterEnd = () => {
   if (!this.validateValue(this.getValue())) {
     return true;
   }
   return false;
 }

  // returns the new value after editing
  getValue() {
    console.log('getvalue', this.eInput.value);
    return this.eInput.value;
  }

  // any cleanup we need to be done here
  destroy() {
    this.eInput.removeEventListener('keydown', this.validateEdit);
  }

  // if true, then this editor will appear in a popup
  isPopup() {
    // and we could leave this method out also, false is the default
    return false;
  }
}

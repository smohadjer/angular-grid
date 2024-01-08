export class AgeEditor {
  // gets called once before the renderer is used
  eInput!: HTMLInputElement;
  oldValue: any;

  init(params: any) {
    this.eInput = document.createElement('input');
    this.eInput.classList.add('numeric-input');
    //this.eInput.addEventListener('keydown', this.validateEdit);
    this.eInput.addEventListener('input', this.validateInput);
    console.log('init', params.value, typeof params.value);
    this.oldValue = params.value;
  }

  // validateEdit = (e: any) => {
  //   if (e.key === 'Tab' || e.key === 'Enter' || e.key === 'Escape') {
  //     if (!this.validateValue(this.getValue())) {
  //       console.log('adding invalid class...');
  //       this.eInput.classList.add('invalid');
  //       e.preventDefault();
  //     }
  //   }
  // }

  validateInput = (e: any) => {
    const value = e.target.value;
    if (isNaN(value) || !this.validateValue(value)) {
      this.eInput.classList.add('invalid');
      e.preventDefault();
    } else {
      this.eInput.classList.remove('invalid');
    }
  }

  validateValue = (value: any) => {
    return value <= 100 && value > 0;
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
    return Number(this.eInput.value);
  }

  // any cleanup we need to be done here
  destroy() {
    //this.eInput.removeEventListener('keydown', this.validateEdit);
    this.eInput.removeEventListener('input', this.validateInput);
  }

  // if true, then this editor will appear in a popup
  isPopup() {
    // and we could leave this method out also, false is the default
    return false;
  }
}

import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[app-dialog]',
})
export class DialogDirective {
  #el = inject<ElementRef<HTMLDialogElement>>(ElementRef);

  ngOnInit(): void {
    this.#el.nativeElement.showModal();
  }
}

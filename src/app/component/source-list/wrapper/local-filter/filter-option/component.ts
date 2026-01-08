import { Component, inject, viewChild, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CssPrefixPipe, MergeClassPipe } from '@piying-lib/angular-daisyui/pipe';
import { AttributesDirective, PI_VIEW_FIELD_TOKEN } from '@piying/view-angular';

@Component({
  selector: 'app-filter-option',
  templateUrl: './component.html',
  imports: [FormsModule, CssPrefixPipe, MergeClassPipe, AttributesDirective, FormsModule],
})
export class FilterOptionNFCC {
  static __version = 2;
  templateRef = viewChild.required('templateRef');
  #field = inject(PI_VIEW_FIELD_TOKEN);
  content: WritableSignal<string> = this.#field().props()['seachContent'];

  stopKeyboardListen(event: KeyboardEvent) {
    event.stopPropagation();
  }
}

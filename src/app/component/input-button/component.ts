import { Component, computed, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { ThemeService } from '@piying-lib/angular-daisyui/service';
import { EventsDirective, AttributesDirective } from '@piying/view-angular';
import { MergeClassPipe } from '@piying-lib/angular-daisyui/pipe';
@Component({
  selector: 'app-input-button',
  templateUrl: './component.html',
  imports: [EventsDirective, AttributesDirective, MergeClassPipe],
})
export class InputButtonNFCC {
  static __version = 2;
  templateRef = viewChild.required('templateRef');
  #theme = inject(ThemeService);
  type = input<'submit' | 'reset'>();
  color = input<string>();
  size = input<string>();
  style = input<'outline' | 'dash' | 'soft' | 'ghost' | 'link'>();
  shape = input<'wide' | 'block' | 'square' | 'circle'>();
  active = input<boolean>();
  clicked = input<(event: PointerEvent) => void | Promise<void>>();
  disabled = input(false);
  disableLoadingIcon = input(false);
  isLoading$ = signal(false);

  async onClick(event: PointerEvent) {
    this.isLoading$.set(true);
    try {
      await this.clicked()?.(event);
    } catch (error) {
      throw error;
    } finally {
      this.isLoading$.set(false);
    }
  }

  wrapperClass$$ = computed(() => {
    return this.#theme.setClass(
      this.#theme.addPrefix('btn'),
      this.#theme.setColor('btn', this.color()),
      this.#theme.setSize('btn', this.size()),
      this.style() ? this.#theme.addPrefix(`btn-${this.style()}`) : undefined,
      this.shape() ? this.#theme.addPrefix(`btn-${this.shape()}`) : undefined,
      this.active() ? this.#theme.addPrefix(`btn-active`) : undefined
    );
  });
}

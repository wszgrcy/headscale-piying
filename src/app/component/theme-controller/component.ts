import { Component, signal, viewChild } from '@angular/core';
const ThemeKey = '__theme';
@Component({
  selector: 'app-theme-controller',
  templateUrl: './component.html',
})
export class ThemeControllerNFCC {
  static __version = 2;
  templateRef = viewChild.required('templateRef');
  value$ = signal(
    typeof localStorage !== 'undefined' ? localStorage.getItem(ThemeKey) === '1' : undefined,
  );

  valueChange(event: any) {
    this.value$.update((a) => !a);
    localStorage.setItem(ThemeKey, this.value$() ? '1' : '0');
  }
}

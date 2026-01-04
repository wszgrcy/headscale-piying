import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';

import { NgTemplateOutlet } from '@angular/common';
import { PiyingViewGroupBase } from '@piying/view-angular';

@Component({
  selector: 'app-ul',
  imports: [NgTemplateOutlet],
  templateUrl: './component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UlGroup extends PiyingViewGroupBase {
  static __version = 2;
  templateRef = viewChild.required('templateRef');
}

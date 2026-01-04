import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PiyingView } from '@piying/view-angular';
import { AsyncPipe } from '@angular/common';
import { FieldGlobalConfig } from '../define';
import { SelectorlessOutlet } from '@cyia/ngx-common/directive';
const defaultValue = Promise.resolve(undefined);
@Component({
  selector: 'app-schema-view',
  templateUrl: './component.html',
  standalone: true,
  imports: [PiyingView, AsyncPipe, SelectorlessOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchemaViewRC {
  route = inject(ActivatedRoute);
  readonly PiyingView = PiyingView;
  context = this.route.snapshot.data['context']?.();
  schema = this.route.snapshot.data['schema']();
  model = resource({ loader: () => this.route.snapshot.data['model']?.() || defaultValue });
  options = {
    context: this.context,
    fieldGlobalConfig: FieldGlobalConfig,
  };
  inputs = {
    schema: this.schema,
    options: this.options,
    model: this.model.value,
    selectorless: true,
  };
}

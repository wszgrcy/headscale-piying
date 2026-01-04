import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  viewChild,
} from '@angular/core';

import { NgTemplateOutlet } from '@angular/common';
import { PI_VIEW_FIELD_TOKEN } from '@piying/view-angular';
import { NodeItem } from '../../../api/item.type';
import { PurePipe } from '@cyia/ngx-common/pipe';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../service/api.service';
import { firstValueFrom } from 'rxjs';
import { TableStatusService } from '@piying-lib/angular-daisyui/extension';
@Component({
  selector: 'app-node-router',
  imports: [NgTemplateOutlet, PurePipe, MatIconModule],
  templateUrl: './component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeRouterNFCC {
  static __version = 2;
  templateRef = viewChild.required('templateRef');
  field$$ = inject(PI_VIEW_FIELD_TOKEN);
  props$$ = computed(() => this.field$$().props());
  #item$$ = computed(() => {
    return this.field$$().context['item$']() as NodeItem;
  });
  list$$ = computed(() => {
    return this.#item$$().availableRoutes;
  });
  approvedRoutes$$ = computed(() => {
    return this.#item$$().approvedRoutes ?? [];
  });
  subnetRoutes$$ = computed(() => {
    return this.#item$$().subnetRoutes ?? [];
  });
  constructor() {
    effect(() => {
      let value = this.field$$().context;
      console.log('!!', value);
      let item = value['item$']();
      console.log(item);
    });
  }

  isApprovedRoutes = (list: string[], item: string) => {
    return list.includes(item);
  };
  isSubnetRoutes = (list: string[], item: string) => {
    return list.includes(item);
  };
  async approvedToggle(item: string, enable: boolean) {
    let list = this.#item$$().approvedRoutes ?? [];
    if (enable) {
      list.push(item);
    } else {
      let index = list.findIndex((item2) => item2 === item);
      list.splice(index, 1);
    }
    await firstValueFrom(
      (this.field$$().context['api'] as ApiService).SetApprovedRoutes(this.#item$$().id!, {
        routes: list,
      })
    );
    (this.field$$().context['status'] as TableStatusService).needUpdate();
  }
}

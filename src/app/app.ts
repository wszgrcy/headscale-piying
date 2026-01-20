import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './service/toast.service';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DialogDirective } from './directive/dialog.directive';
import { ConfirmService } from './service/confirm.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatIconModule, ClipboardModule,DialogDirective],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  #toast = inject(ToastService);
  #confirm = inject(ConfirmService);
  readonly list$$ = this.#toast.list$$;
  readonly dialogList$$ = this.#confirm.list$$;
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './service/toast.service';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ConfirmService } from './service/confirm.service';
import { MergeClassPipe } from '@piying-lib/angular-daisyui/pipe';
import { PurePipe } from '@cyia/ngx-common/pipe';
import { SelectorlessOutlet } from '@cyia/ngx-common/directive';
import { StrOrTemplateComponent } from '@piying-lib/angular-core';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatIconModule,
    ClipboardModule,
    MergeClassPipe,
    PurePipe,
    SelectorlessOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  #toast = inject(ToastService);
  readonly list$$ = this.#toast.list$$;
  #confirm = inject(ConfirmService);
  readonly dialogList$$ = this.#confirm.list$$;
  readonly StrOrTemplateComponent = StrOrTemplateComponent;
  buttonContent = (content: any) => {
    return { content };
  };
}

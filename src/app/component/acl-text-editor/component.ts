import { afterNextRender, Component, ElementRef, forwardRef, inject, signal } from '@angular/core';
import { BaseControl } from '@piying/view-angular';
import { AmdInit$$ } from '../../monaco-editor/init';
import type { editor } from 'monaco-editor';
import { HttpClient } from '@angular/common/http';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'div[type=acl-editor]',
  templateUrl: './component.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ACLTxtEditorFCC), multi: true },
  ],
})
export class ACLTxtEditorFCC extends BaseControl {
  #eleRef = inject<ElementRef<HTMLElement>>(ElementRef);
  #inited = Promise.withResolvers<editor.IStandaloneCodeEditor>();
  #http = inject(HttpClient);
  constructor() {
    super();
    afterNextRender(() => {
      AmdInit$$()
        .then(() => {
          return this.init();
        })
        .then((i) => {
          this.#inited.resolve(i);
        });
    });
  }
  override writeValue(value: any): void {
    super.writeValue(value);
    this.#inited.promise.then((instance) => {
      instance.setValue(value ?? '');
    });
  }
  async init() {
    const modelUri = monaco.Uri.parse('a://b/foo.json');
    const model = monaco.editor.createModel(``, 'json', modelUri);
    this.#http.get('./acl.json-schema.json').subscribe((value) => {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [
          {
            uri: 'http://acl.json',
            fileMatch: [modelUri.toString()],
            schema: value,
          },
        ],
      });
    });

    const instance = monaco.editor.create(this.#eleRef.nativeElement, {
      model,
      language: 'json',
      minimap: { enabled: false },
    });
    instance.onDidChangeModelContent((e) => {
      this.valueChange(instance.getValue());
    });
    return instance;
  }
}

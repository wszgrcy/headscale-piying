import { Component, input } from '@angular/core';

@Component({
  selector: 'div',
  templateUrl: './component.html',
})
export class CardBodyDemoNFCC {
  data = input<any>();
}

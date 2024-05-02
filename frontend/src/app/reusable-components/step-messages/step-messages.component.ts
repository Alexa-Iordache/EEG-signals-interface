import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-step-messages',
  templateUrl: './step-messages.component.html',
  styleUrls: ['./step-messages.component.scss']
})
export class StepMessagesComponent {

  // Input representing step number
  @Input() step = 0;
}

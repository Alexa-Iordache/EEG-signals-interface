import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepMessagesComponent } from './step-messages.component';

describe('StepMessagesComponent', () => {
  let component: StepMessagesComponent;
  let fixture: ComponentFixture<StepMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepMessagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingModelComponent } from './existing-model.component';

describe('ExistingModelComponent', () => {
  let component: ExistingModelComponent;
  let fixture: ComponentFixture<ExistingModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExistingModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistingModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

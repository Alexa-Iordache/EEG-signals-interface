import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRecordingComponent } from './delete-recording.component';

describe('DeleteRecordingComponent', () => {
  let component: DeleteRecordingComponent;
  let fixture: ComponentFixture<DeleteRecordingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteRecordingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteRecordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

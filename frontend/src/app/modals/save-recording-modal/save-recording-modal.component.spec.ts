import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveRecordingModalComponent } from './save-recording-modal.component';

describe('SaveRecordingModalComponent', () => {
  let component: SaveRecordingModalComponent;
  let fixture: ComponentFixture<SaveRecordingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveRecordingModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveRecordingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveRecrdingModalComponent } from './stop-recording-modal.component';

describe('SaveRecrdingModalComponent', () => {
  let component: SaveRecrdingModalComponent;
  let fixture: ComponentFixture<SaveRecrdingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveRecrdingModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveRecrdingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

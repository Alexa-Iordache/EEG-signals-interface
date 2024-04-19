import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteObstacleModalComponent } from './delete-obstacle-modal.component';

describe('DeleteObstacleModalComponent', () => {
  let component: DeleteObstacleModalComponent;
  let fixture: ComponentFixture<DeleteObstacleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteObstacleModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteObstacleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

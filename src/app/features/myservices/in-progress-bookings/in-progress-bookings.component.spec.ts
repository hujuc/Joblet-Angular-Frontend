import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InProgressBookingsComponent } from './in-progress-bookings.component';

describe('InProgressBookingsComponent', () => {
  let component: InProgressBookingsComponent;
  let fixture: ComponentFixture<InProgressBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InProgressBookingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InProgressBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

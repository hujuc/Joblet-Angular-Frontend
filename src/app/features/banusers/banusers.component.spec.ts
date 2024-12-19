import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanusersComponent } from './banusers.component';

describe('BanusersComponent', () => {
  let component: BanusersComponent;
  let fixture: ComponentFixture<BanusersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BanusersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BanusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

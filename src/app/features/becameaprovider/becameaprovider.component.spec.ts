import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecameaproviderComponent } from './becameaprovider.component';

describe('BecameaproviderComponent', () => {
  let component: BecameaproviderComponent;
  let fixture: ComponentFixture<BecameaproviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecameaproviderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BecameaproviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

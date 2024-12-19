import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyservicesComponent } from './myservices.component';

describe('MyservicesComponent', () => {
  let component: MyservicesComponent;
  let fixture: ComponentFixture<MyservicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyservicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

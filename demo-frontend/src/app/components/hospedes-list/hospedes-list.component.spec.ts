import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospedesListComponent } from './hospedes-list.component';

describe('HospedesListComponent', () => {
  let component: HospedesListComponent;
  let fixture: ComponentFixture<HospedesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HospedesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospedesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

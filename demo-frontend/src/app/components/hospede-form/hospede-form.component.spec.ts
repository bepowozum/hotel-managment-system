import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospedeFormComponent } from './hospede-form.component';

describe('HospedeFormComponent', () => {
  let component: HospedeFormComponent;
  let fixture: ComponentFixture<HospedeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HospedeFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospedeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

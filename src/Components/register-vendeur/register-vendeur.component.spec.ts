import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnregistrerVendeurComponent } from './register-vendeur.component';

describe('EnregistrerVendeurComponent', () => {
  let component: EnregistrerVendeurComponent;
  let fixture: ComponentFixture<EnregistrerVendeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnregistrerVendeurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnregistrerVendeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

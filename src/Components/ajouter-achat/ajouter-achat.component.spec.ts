import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteComponent } from './ajouter-achat.component';

describe('VenteComponent', () => {
  let component: VenteComponent;
  let fixture: ComponentFixture<VenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

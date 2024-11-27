import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficherBilanComponent } from './afficher-bilan.component';

describe('AfficherBilanComponent', () => {
  let component: AfficherBilanComponent;
  let fixture: ComponentFixture<AfficherBilanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfficherBilanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficherBilanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

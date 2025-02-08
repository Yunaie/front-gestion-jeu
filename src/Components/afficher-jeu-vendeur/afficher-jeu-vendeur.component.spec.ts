import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficherJeuVendeurComponent } from './afficher-jeu-vendeur.component';

describe('AfficherJeuComponent', () => {
  let component: AfficherJeuVendeurComponent;
  let fixture: ComponentFixture<AfficherJeuVendeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfficherJeuVendeurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficherJeuVendeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

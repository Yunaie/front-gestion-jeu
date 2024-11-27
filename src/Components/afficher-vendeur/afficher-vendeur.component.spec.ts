import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficherVendeurComponent } from './afficher-vendeur.component';

describe('AfficherVendeurComponent', () => {
  let component: AfficherVendeurComponent;
  let fixture: ComponentFixture<AfficherVendeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfficherVendeurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficherVendeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

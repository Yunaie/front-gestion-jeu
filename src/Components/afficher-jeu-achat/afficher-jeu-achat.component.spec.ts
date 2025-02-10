import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficherJeuAchatComponent } from './afficher-jeu-achat.component';

describe('AfficherJeuComponent', () => {
  let component: AfficherJeuAchatComponent;
  let fixture: ComponentFixture<AfficherJeuAchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfficherJeuAchatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficherJeuAchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

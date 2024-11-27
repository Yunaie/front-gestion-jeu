import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficherJeuComponent } from './afficher-jeu.component';

describe('AfficherJeuComponent', () => {
  let component: AfficherJeuComponent;
  let fixture: ComponentFixture<AfficherJeuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfficherJeuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficherJeuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

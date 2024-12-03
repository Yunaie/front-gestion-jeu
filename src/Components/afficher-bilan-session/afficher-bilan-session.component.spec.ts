import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficherBilanSessionComponent } from './afficher-bilan-session.component';

describe('AfficherBilanSessionComponent', () => {
  let component: AfficherBilanSessionComponent;
  let fixture: ComponentFixture<AfficherBilanSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfficherBilanSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficherBilanSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficherSessionComponent } from './afficher-session.component';

describe('AfficherSessionComponent', () => {
  let component: AfficherSessionComponent;
  let fixture: ComponentFixture<AfficherSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfficherSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficherSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

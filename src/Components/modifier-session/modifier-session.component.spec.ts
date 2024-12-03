import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierSessionComponent } from './modifier-session.component';

describe('AfficherSessionComponent', () => {
  let component: ModifierSessionComponent;
  let fixture: ComponentFixture<ModifierSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

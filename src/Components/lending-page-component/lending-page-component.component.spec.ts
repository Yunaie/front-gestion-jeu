import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LendingPageComponentComponent } from './lending-page-component.component';

describe('LendingPageComponentComponent', () => {
  let component: LendingPageComponentComponent;
  let fixture: ComponentFixture<LendingPageComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LendingPageComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LendingPageComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoixAdminComponent } from './choix-admin.component';

describe('ChoixAdminComponent', () => {
  let component: ChoixAdminComponent;
  let fixture: ComponentFixture<ChoixAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoixAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoixAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginVendeurComponent } from './login-vendeur.component';

describe('LoginVendeurComponent', () => {
  let component: LoginVendeurComponent;
  let fixture: ComponentFixture<LoginVendeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginVendeurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginVendeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListGroupComponent } from './user-list-group.component';

describe('UserListGroupComponent', () => {
  let component: UserListGroupComponent;
  let fixture: ComponentFixture<UserListGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

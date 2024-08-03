import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListControlsComponent } from './user-list-controls.component';

describe('UserListControlsComponent', () => {
  let component: UserListControlsComponent;
  let fixture: ComponentFixture<UserListControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

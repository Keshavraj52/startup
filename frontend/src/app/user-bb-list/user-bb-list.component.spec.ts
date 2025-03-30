import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBbListComponent } from './user-bb-list.component';

describe('UserBbListComponent', () => {
  let component: UserBbListComponent;
  let fixture: ComponentFixture<UserBbListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBbListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserBbListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

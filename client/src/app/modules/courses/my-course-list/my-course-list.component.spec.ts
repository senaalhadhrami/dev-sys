import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCourseListComponent } from './my-course-list.component';

describe('MyCourseListComponent', () => {
  let component: MyCourseListComponent;
  let fixture: ComponentFixture<MyCourseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCourseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCourseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

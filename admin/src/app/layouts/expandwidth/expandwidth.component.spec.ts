import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandwidthComponent } from './expandwidth.component';

describe('ExpandwidthComponent', () => {
  let component: ExpandwidthComponent;
  let fixture: ComponentFixture<ExpandwidthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpandwidthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandwidthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

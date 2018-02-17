import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EfsComponent } from './efs.component';

describe('EfsComponent', () => {
  let component: EfsComponent;
  let fixture: ComponentFixture<EfsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EfsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EfsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

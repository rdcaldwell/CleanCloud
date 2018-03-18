import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JanitordialogComponent } from './janitordialog.component';

describe('JanitordialogComponent', () => {
  let component: JanitordialogComponent;
  let fixture: ComponentFixture<JanitordialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JanitordialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JanitordialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

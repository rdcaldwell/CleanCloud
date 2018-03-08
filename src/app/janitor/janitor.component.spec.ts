import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JanitorComponent } from './janitor.component';

describe('JanitorComponent', () => {
  let component: JanitorComponent;
  let fixture: ComponentFixture<JanitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JanitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JanitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

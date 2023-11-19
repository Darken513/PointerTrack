import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeKeyInputComponent } from './code-key-input.component';

describe('CodeKeyInputComponent', () => {
  let component: CodeKeyInputComponent;
  let fixture: ComponentFixture<CodeKeyInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CodeKeyInputComponent]
    });
    fixture = TestBed.createComponent(CodeKeyInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

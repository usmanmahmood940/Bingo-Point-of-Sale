import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInentoryComponent } from './edit-inentory.component';

describe('EditInentoryComponent', () => {
  let component: EditInentoryComponent;
  let fixture: ComponentFixture<EditInentoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInentoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInentoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

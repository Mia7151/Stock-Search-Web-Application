import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionButtonComponent } from './transaction-button.component';

describe('TransactionButtonComponent', () => {
  let component: TransactionButtonComponent;
  let fixture: ComponentFixture<TransactionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignalRClientComponent } from './signal-r-client.component';

describe('SignalrClientComponent', () => {
  let component: SignalRClientComponent;
  let fixture: ComponentFixture<SignalRClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalRClientComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SignalRClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

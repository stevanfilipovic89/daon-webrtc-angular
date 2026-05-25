import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Instructions } from './instructions';

describe('Instructions', () => {
  let component: Instructions;
  let fixture: ComponentFixture<Instructions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Instructions],
    }).compileComponents();

    fixture = TestBed.createComponent(Instructions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title', () => {
    const title = fixture.nativeElement.querySelector('h1') as HTMLHeadingElement;

    expect(title.textContent).toContain('Video capture');
  });

  it('should render the description', () => {
    const paragraph = fixture.nativeElement.querySelector('p') as HTMLParagraphElement;

    expect(paragraph.textContent).toContain(
      'Click the button to allow camera access.'
    );
  });

  it('should render the Start button', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button).toBeTruthy();
    expect(button.textContent?.trim()).toBe('Start');
  });

  it('should not show retake message by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).not.toContain(
      'You can click the button again to retake the photo.'
    );
  });

  it('should show retake message when hasCapturedImage is true', () => {
    fixture.componentRef.setInput('hasCapturedImage', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain(
      'You can click the button again to retake the photo.'
    );
  });

  it('should emit isCaptureStarted when Start button is clicked', () => {
    spyOn(component.isCaptureStarted, 'emit');

    const button = fixture.debugElement.query(By.css('button'));

    button.triggerEventHandler('click');
    fixture.detectChanges();

    expect(component.isCaptureStarted.emit).toHaveBeenCalled();
  });
});
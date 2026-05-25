import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnapshotResult } from './snapshot-result';

describe('SnapshotResult', () => {
  let component: SnapshotResult;
  let fixture: ComponentFixture<SnapshotResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnapshotResult],
    }).compileComponents();

    fixture = TestBed.createComponent(SnapshotResult);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show placeholder text when there is no captured image', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain(
      'Captured image will be shown in this section'
    );
  });

  it('should not render image when there is no captured image', () => {
    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement | null;

    expect(image).toBeNull();
  });

  it('should show captured image title when captured image exists', () => {
    fixture.componentRef.setInput(
      'capturedImage',
      'data:image/png;base64,test-image'
    );

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Captured image');
  });

  it('should render image when captured image exists', () => {
    const imageDataUrl = 'data:image/png;base64,test-image';

    fixture.componentRef.setInput('capturedImage', imageDataUrl);
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;

    expect(image).toBeTruthy();
    expect(image.getAttribute('src')).toBe(imageDataUrl);
    expect(image.getAttribute('alt')).toBe('Captured snapshot');
  });
});
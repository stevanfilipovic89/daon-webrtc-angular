import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { App } from './app';

@Component({
  selector: 'app-instructions',
  standalone: true,
  template: '',
})
class InstructionsStub {
  @Input() hasCapturedImage = false;
  @Output() isCaptureStarted = new EventEmitter<void>();
}

@Component({
  selector: 'app-video-preview',
  standalone: true,
  template: '',
})
class VideoPreviewStub {
  @Output() snapshotCaptured = new EventEmitter<string>();
}

@Component({
  selector: 'app-snapshot-result',
  standalone: true,
  template: '',
})
class SnapshotResultStub {
  @Input() capturedImage: string | null = null;
}

describe('App', () => {
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    })
      .overrideComponent(App, {
        set: {
          imports: [InstructionsStub, VideoPreviewStub, SnapshotResultStub],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render instructions and snapshot result components by default', () => {
    const instructions = fixture.debugElement.query(By.directive(InstructionsStub));
    const snapshotResult = fixture.debugElement.query(By.directive(SnapshotResultStub));

    expect(instructions).toBeTruthy();
    expect(snapshotResult).toBeTruthy();
  });

  it('should not render video preview before capture is started', () => {
    const videoPreview = fixture.debugElement.query(By.directive(VideoPreviewStub));

    expect(videoPreview).toBeNull();
  });

  it('should render video preview when capture is started', () => {
    const instructionsDebugElement = fixture.debugElement.query(
      By.directive(InstructionsStub)
    );

    const instructionsComponent =
      instructionsDebugElement.componentInstance as InstructionsStub;

    instructionsComponent.isCaptureStarted.emit();
    fixture.detectChanges();

    const videoPreview = fixture.debugElement.query(By.directive(VideoPreviewStub));

    expect(videoPreview).toBeTruthy();
  });

  it('should pass false to hasCapturedImage before a snapshot is captured', () => {
    const instructionsDebugElement = fixture.debugElement.query(
      By.directive(InstructionsStub)
    );

    const instructionsComponent =
      instructionsDebugElement.componentInstance as InstructionsStub;

    expect(instructionsComponent.hasCapturedImage).toBeFalse();
  });

  it('should pass captured image to snapshot result when snapshot is captured', () => {
    const imageDataUrl = 'data:image/png;base64,test-image';

    const instructionsComponent = fixture.debugElement.query(
      By.directive(InstructionsStub)
    ).componentInstance as InstructionsStub;

    instructionsComponent.isCaptureStarted.emit();
    fixture.detectChanges();

    const videoPreviewComponent = fixture.debugElement.query(
      By.directive(VideoPreviewStub)
    ).componentInstance as VideoPreviewStub;

    videoPreviewComponent.snapshotCaptured.emit(imageDataUrl);
    fixture.detectChanges();

    const snapshotResultComponent = fixture.debugElement.query(
      By.directive(SnapshotResultStub)
    ).componentInstance as SnapshotResultStub;

    expect(snapshotResultComponent.capturedImage).toBe(imageDataUrl);
  });

  it('should hide video preview after a snapshot is captured', () => {
    const imageDataUrl = 'data:image/png;base64,test-image';

    const instructionsComponent = fixture.debugElement.query(
      By.directive(InstructionsStub)
    ).componentInstance as InstructionsStub;

    instructionsComponent.isCaptureStarted.emit();
    fixture.detectChanges();

    const videoPreviewComponent = fixture.debugElement.query(
      By.directive(VideoPreviewStub)
    ).componentInstance as VideoPreviewStub;

    videoPreviewComponent.snapshotCaptured.emit(imageDataUrl);
    fixture.detectChanges();

    const videoPreview = fixture.debugElement.query(By.directive(VideoPreviewStub));

    expect(videoPreview).toBeNull();
  });

  it('should pass true to hasCapturedImage after a snapshot is captured', () => {
    const imageDataUrl = 'data:image/png;base64,test-image';

    const instructionsComponent = fixture.debugElement.query(
      By.directive(InstructionsStub)
    ).componentInstance as InstructionsStub;

    instructionsComponent.isCaptureStarted.emit();
    fixture.detectChanges();

    const videoPreviewComponent = fixture.debugElement.query(
      By.directive(VideoPreviewStub)
    ).componentInstance as VideoPreviewStub;

    videoPreviewComponent.snapshotCaptured.emit(imageDataUrl);
    fixture.detectChanges();

    const updatedInstructionsComponent = fixture.debugElement.query(
      By.directive(InstructionsStub)
    ).componentInstance as InstructionsStub;

    expect(updatedInstructionsComponent.hasCapturedImage).toBeTrue();
  });

  it('should reset captured image when capture is started again', () => {
    const imageDataUrl = 'data:image/png;base64,test-image';

    const instructionsComponent = fixture.debugElement.query(
      By.directive(InstructionsStub)
    ).componentInstance as InstructionsStub;

    instructionsComponent.isCaptureStarted.emit();
    fixture.detectChanges();

    const videoPreviewComponent = fixture.debugElement.query(
      By.directive(VideoPreviewStub)
    ).componentInstance as VideoPreviewStub;

    videoPreviewComponent.snapshotCaptured.emit(imageDataUrl);
    fixture.detectChanges();

    instructionsComponent.isCaptureStarted.emit();
    fixture.detectChanges();

    const snapshotResultComponent = fixture.debugElement.query(
      By.directive(SnapshotResultStub)
    ).componentInstance as SnapshotResultStub;

    expect(snapshotResultComponent.capturedImage).toBeNull();
  });
});
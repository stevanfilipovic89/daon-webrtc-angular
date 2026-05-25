import { CommonModule } from '@angular/common';
import { Component, ElementRef, output, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-video-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-preview.html',
  styleUrl: './video-preview.scss',
})
export class VideoPreview {
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  countdown = signal<number | null>(null);

  private snapshotTimeoutId: number | null = null;
  private countdownIntervalId: number | null = null;

  videoElement = viewChild<ElementRef<HTMLVideoElement>>('videoElement');
  private stream: MediaStream | null = null;

  snapshotCaptured = output<string>();

  ngAfterViewInit(): void {
    this.startVideoStream();
  }

  private async startVideoStream() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      const video = this.videoElement();

      if (video) {
        video.nativeElement.srcObject = this.stream;
      }
      this.startSnapshotTimer();
    } catch {
      this.errorMessage.set('Camera access was denied or the camera is not available.');
    } finally {
      this.isLoading.set(false);
    }
  }

  private startSnapshotTimer(): void {
    this.clearSnapshotTimer();
    this.clearCountdownTimer();

    this.countdown.set(5);

    this.countdownIntervalId = window.setInterval(() => {
      const currentValue = this.countdown();

      if (currentValue === null) {
        return;
      }

      if (currentValue <= 0) {
        this.clearCountdownTimer();
        return;
      }

      this.countdown.set(currentValue - 1);
    }, 1000);

    this.snapshotTimeoutId = window.setTimeout(() => {
      this.captureSnapshot();
    }, 5000);
  }

  private clearCountdownTimer(): void {
    if (this.countdownIntervalId === null) {
      return;
    }

    window.clearInterval(this.countdownIntervalId);
    this.countdownIntervalId = null;
  }

  private clearSnapshotTimer(): void {
    if (this.snapshotTimeoutId === null) {
      return;
    }

    window.clearTimeout(this.snapshotTimeoutId);
    this.snapshotTimeoutId = null;
  }

  private captureSnapshot() {
    const video = this.videoElement()?.nativeElement;

    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/png');

    this.snapshotCaptured.emit(imageDataUrl);
    this.clearCountdownTimer();
    this.countdown.set(null);

    this.stopCamera();
  }

  private stopCamera(): void {
    if (!this.stream) {
      return;
    }

    this.stream.getTracks().forEach((track) => track.stop());
    this.stream = null;
  }

  ngOnDestroy(): void {
    this.clearSnapshotTimer();
    this.clearCountdownTimer();
    this.stopCamera();
  }
}

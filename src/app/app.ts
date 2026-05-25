import { Component, computed, signal } from '@angular/core';
import { Instructions } from './components/instructions/instructions';
import { VideoPreview } from './components/video-preview/video-preview';
import { SnapshotResult } from './components/snapshot-result/snapshot-result';

@Component({
  selector: 'app-root',
  imports: [Instructions, VideoPreview, SnapshotResult],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly isCaptureStarted = signal(false);
  protected readonly capturedImage = signal<string | null>(null);

  protected readonly hasCapturedImage = computed(() => {
    const image = this.capturedImage();

    return image !== null && image.trim().length > 0;
  });

  protected onStartClicked(): void {
    this.isCaptureStarted.set(true);
    this.capturedImage.set(null);
  }

  protected onSnapshotCaptured(imageDataUrl: string): void {
    this.capturedImage.set(imageDataUrl);
  }
}
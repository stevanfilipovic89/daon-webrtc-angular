import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-snapshot-result',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './snapshot-result.html',
  styleUrl: './snapshot-result.scss',
})
export class SnapshotResult {
  capturedImage = input<string | null>(null);
}

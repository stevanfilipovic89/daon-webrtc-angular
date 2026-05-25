import { Component, output, input } from '@angular/core';

@Component({
  selector: 'app-instructions',
  standalone: true,
  imports: [],
  templateUrl: './instructions.html',
  styleUrl: './instructions.scss',
})
export class Instructions {
  isCaptureStarted = output<void>();
  hasCapturedImage = input<boolean>(false);

  onStartClick() {
    this.isCaptureStarted.emit();
  }
}

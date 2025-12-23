import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-copy-text',
  templateUrl: './copy-text.component.html',
  styleUrl: './copy-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  host: {
    class: 'copy-text',
    '(click)': 'onCopy()'
  }
})
export class CopyTextComponent {
  value = input.required<string>();

  private readonly clipboard = inject(Clipboard);
  private readonly snackBar = inject(MatSnackBar);

  protected onCopy(): void {
    const success = this.clipboard.copy(this.value());

    if (success) {
      this.snackBar.open('Copied to clipboard', undefined, {
        duration: 2000
      });
    }
  }
}


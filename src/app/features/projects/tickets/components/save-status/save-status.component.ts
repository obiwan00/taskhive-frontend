import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export type SaveStatus = 'saved' | 'error' | null;

@Component({
  selector: 'app-save-status',
  templateUrl: './save-status.component.html',
  styleUrl: './save-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ]
})
export class SaveStatusComponent {
  saveStatus = input.required<SaveStatus>();
  hasUnsavedChanges = input<boolean>(false);
  updating = input<boolean>(false);

  retry = output<void>();

  protected onRetry(): void {
    this.retry.emit();
  }
}


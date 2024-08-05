import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  public currentPage = input<number>(1);
  public nextClicked = output<void>();
  public prevClicked = output<void>();
  public isLoading = input<boolean>(false);

  public onNextClicked(): void {
    if (this.isLoading()) {
      return;
    }
    this.nextClicked.emit();
  }
  public onPrevClicked(): void {
    if (this.isLoading()) {
      return;
    }
    this.prevClicked.emit();
  }
}

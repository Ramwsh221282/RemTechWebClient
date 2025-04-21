import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-characteristics-filter-input',
  imports: [TableModule],
  templateUrl: './characteristics-filter-input.component.html',
  styleUrl: './characteristics-filter-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacteristicsFilterInputComponent {
  public constructor() {}
}

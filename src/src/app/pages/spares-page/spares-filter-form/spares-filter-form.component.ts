import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-spares-filter-form',
  imports: [PanelModule],
  templateUrl: './spares-filter-form.component.html',
  styleUrl: './spares-filter-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SparesFilterFormComponent { }

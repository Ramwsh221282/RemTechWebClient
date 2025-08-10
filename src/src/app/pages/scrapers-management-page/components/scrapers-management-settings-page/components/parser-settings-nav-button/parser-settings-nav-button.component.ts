import { Component, Input, signal, WritableSignal } from '@angular/core';
import { Scraper } from '../../types/Scraper';
import { Router } from '@angular/router';
import { VehicleBrand } from '../../../../../vehicles-catalogue-select-page/data/types/vehiclebrands';
import { VehicleModel } from '../../../../../vehicles-catalogue-select-page/data/types/vehiclemodel';
import { VehicleKind } from '../../../../../vehicles-catalogue-select-page/data/types/vehiclekind';

@Component({
  selector: 'app-parser-settings-nav-button',
  imports: [],
  templateUrl: './parser-settings-nav-button.component.html',
  styleUrl: './parser-settings-nav-button.component.scss',
})
export class ParserSettingsNavButtonComponent {
  @Input({ required: true }) set scraper_setter(value: Scraper) {
    this._scraper.set(value);
  }

  private readonly _scraper: WritableSignal<Scraper>;
  private readonly _router: Router;

  constructor(router: Router) {
    this._scraper = signal({
      name: '',
      domain: '',
      hours: 0,
      lastRun: new Date(),
      nextRun: new Date(),
      links: [],
      minutes: 0,
      processed: 0,
      seconds: 0,
      state: '',
      totalSeconds: 0,
      type: '',
      waitDays: 0,
    });
    this._router = router;
  }

  public get scraper(): string {
    return this._scraper().name;
  }

  public get type(): string {
    return this._scraper().type;
  }

  public onClick(): void {
    const scraper: Scraper = this._scraper();
    const name: string = scraper.name;
    const type: string = scraper.type;
    this._router.navigate(['/scrapers', 'settings', name, type]);
  }
}

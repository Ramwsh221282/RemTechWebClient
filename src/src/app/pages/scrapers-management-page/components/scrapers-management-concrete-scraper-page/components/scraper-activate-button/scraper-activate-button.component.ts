import { Component, Input, signal, WritableSignal } from '@angular/core';
import { Scraper } from '../../../scrapers-management-settings-page/types/Scraper';
import { VehicleScrapersService } from '../../../scrapers-management-settings-page/services/vehicle-scrapers.service';

@Component({
  selector: 'app-scraper-activate-button',
  imports: [],
  templateUrl: './scraper-activate-button.component.html',
  styleUrl: './scraper-activate-button.component.scss',
})
export class ScraperActivateButtonComponent {
  @Input({ required: true }) set scraper_setter(value: Scraper) {
    this._scraper.set(value);
  }
  private readonly _scraper: WritableSignal<Scraper>;
  constructor() {
    this._scraper = signal(VehicleScrapersService.defaultScraper());
  }

  public get domain(): string {
    return this._scraper().domain;
  }
}

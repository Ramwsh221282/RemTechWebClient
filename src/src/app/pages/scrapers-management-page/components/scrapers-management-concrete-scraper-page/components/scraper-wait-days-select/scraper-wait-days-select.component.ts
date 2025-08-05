import {
  Component,
  Input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { Scraper } from '../../../scrapers-management-settings-page/types/Scraper';
import { VehicleScrapersService } from '../../../scrapers-management-settings-page/services/vehicle-scrapers.service';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-scraper-wait-days-select',
  imports: [FormsModule, NgForOf, Select],
  templateUrl: './scraper-wait-days-select.component.html',
  styleUrl: './scraper-wait-days-select.component.scss',
})
export class ScraperWaitDaysSelectComponent implements OnInit {
  @Input({ required: true }) set scraper_setter(value: Scraper) {
    this._scraper.set(value);
  }

  private readonly _scraper: WritableSignal<Scraper>;
  private readonly _scraperWaitDays: WritableSignal<number[]>;

  constructor() {
    this._scraper = signal(VehicleScrapersService.defaultScraper());
    this._scraperWaitDays = signal([]);
  }

  public ngOnInit(): void {
    this._scraperWaitDays.set([1, 2, 3, 4, 5, 6, 7]);
  }

  public get waitDaysOptions(): number[] {
    return this._scraperWaitDays();
  }

  public get nextRunDate(): Date {
    return this._scraper().nextRun;
  }
}

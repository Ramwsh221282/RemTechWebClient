import { Component, Input, signal, WritableSignal } from '@angular/core';
import { Button } from 'primeng/button';
import { NgForOf, NgIf } from '@angular/common';
import { Scraper } from '../../../scrapers-management-settings-page/types/Scraper';
import { ScraperLink } from '../../../scrapers-management-settings-page/types/ScraperLink';

@Component({
  selector: 'app-scraper-links-list',
  imports: [Button, NgForOf, NgIf],
  templateUrl: './scraper-links-list.component.html',
  styleUrl: './scraper-links-list.component.scss',
})
export class ScraperLinksListComponent {
  @Input({ required: true }) set scraper_links_setter(value: ScraperLink[]) {
    this._scraperLinks.set(value);
  }

  private readonly _scraperLinks: WritableSignal<ScraperLink[]>;

  constructor() {
    this._scraperLinks = signal([]);
  }

  public get links(): ScraperLink[] {
    return this._scraperLinks();
  }
}

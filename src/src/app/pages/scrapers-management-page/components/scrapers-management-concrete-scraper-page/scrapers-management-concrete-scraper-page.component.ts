import {
  Component,
  DestroyRef,
  effect,
  EventEmitter,
  inject,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VehicleScrapersService } from '../scrapers-management-settings-page/services/vehicle-scrapers.service';
import { Scraper } from '../scrapers-management-settings-page/types/Scraper';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { Button } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ScraperDomainInfoComponent } from './components/scraper-domain-info/scraper-domain-info.component';
import { ScraperLastRunInfoComponent } from './components/scraper-last-run-info/scraper-last-run-info.component';
import { ScraperNextRunInfoComponent } from './components/scraper-next-run-info/scraper-next-run-info.component';
import { ScraperWaitDaysSelectComponent } from './components/scraper-wait-days-select/scraper-wait-days-select.component';
import { ScraperProcessedAmountComponent } from './components/scraper-processed-amount/scraper-processed-amount.component';
import { ScraperElapsedTimeComponent } from './components/scraper-elapsed-time/scraper-elapsed-time.component';
import { ScraperStateSelectComponent } from './components/scraper-state-select/scraper-state-select.component';
import { ScraperLinksListComponent } from './components/scraper-links-list/scraper-links-list.component';
import { ScraperActivateButtonComponent } from './components/scraper-activate-button/scraper-activate-button.component';
import { ScraperDeactivateButtonComponent } from './components/scraper-deactivate-button/scraper-deactivate-button.component';
import { ScraperAddLinkDialogComponent } from './components/scraper-add-link-dialog/scraper-add-link-dialog.component';
import { MessageService } from 'primeng/api';
import { ScraperLink } from '../scrapers-management-settings-page/types/ScraperLink';
import { ScraperEditLinkDialogComponent } from './components/scraper-edit-link-dialog/scraper-edit-link-dialog.component';

@Component({
  selector: 'app-scrapers-management-concrete-scraper-page',
  imports: [
    FormsModule,
    ScraperDomainInfoComponent,
    ScraperLastRunInfoComponent,
    ScraperNextRunInfoComponent,
    ScraperWaitDaysSelectComponent,
    ScraperProcessedAmountComponent,
    ScraperElapsedTimeComponent,
    ScraperStateSelectComponent,
    ScraperLinksListComponent,
    ScraperActivateButtonComponent,
    ScraperDeactivateButtonComponent,
    ScraperAddLinkDialogComponent,
    ScraperEditLinkDialogComponent,
    NgIf,
  ],
  templateUrl: './scrapers-management-concrete-scraper-page.component.html',
  styleUrl: './scrapers-management-concrete-scraper-page.component.scss',
  providers: [MessageService],
})
export class ScrapersManagementConcreteScraperPageComponent {
  @Output() parserLinkRemoved: EventEmitter<Scraper> =
    new EventEmitter<Scraper>();
  private readonly _scraper: WritableSignal<Scraper>;
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _isCreatingLink: WritableSignal<boolean>;
  private readonly _isEditingLink: WritableSignal<boolean>;
  private readonly _linkToEdit: WritableSignal<ScraperLink | null>;
  private readonly _messageService: MessageService;

  constructor(
    activatedRoute: ActivatedRoute,
    service: VehicleScrapersService,
    messageService: MessageService,
  ) {
    this._linkToEdit = signal(null);
    this._isEditingLink = signal(false);
    this._messageService = messageService;
    this._scraper = signal(VehicleScrapersService.defaultScraper());
    this._isCreatingLink = signal(false);
    effect((): void => {
      activatedRoute.params
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe((param) => {
          const name = param['scraperName'] as string;
          const type = param['scraperType'] as string;
          service
            .fetchConcrete(name, type)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
              next: (scraper: Scraper): void => {
                this._scraper.set(scraper);
              },
              error: (err: HttpErrorResponse): void =>
                console.log(err.error.message),
            });
        });
    });
  }

  public get scraperLinkToEdit(): ScraperLink | null {
    return this._linkToEdit();
  }

  public acceptCreatingLink(flag: boolean): void {
    this._isCreatingLink.set(flag);
  }

  public acceptLinkEditClick(flag: boolean): void {
    console.log(flag);
    this._isEditingLink.set(flag);
  }

  public get isCreatingLink(): boolean {
    return this._isCreatingLink();
  }

  public acceptLinkToEdit(link: ScraperLink): void {
    this._linkToEdit.set(link);
  }

  public acceptScraperChangedState($event: Scraper): void {
    this._scraper.set($event);
  }

  public onEditClose(): void {
    this._isEditingLink.set(false);
    this._linkToEdit.set(null);
  }

  public get isEditingLink(): boolean {
    return this._isEditingLink();
  }

  public get scraper(): Scraper {
    return this._scraper();
  }
}

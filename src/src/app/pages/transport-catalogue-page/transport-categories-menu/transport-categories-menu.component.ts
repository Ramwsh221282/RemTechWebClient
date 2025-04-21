import {Component, OnInit} from '@angular/core';
import {TransportCategoriesViewModel} from './services/transport-categories-viewmodel';
import {Panel} from 'primeng/panel';
import {SearchBarComponent} from '../../../shared/components/search-bar/search-bar.component';
import {Title} from '@angular/platform-browser';
import {TransportCategory} from './types/TransportCategory';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Button} from 'primeng/button';
import {ScrollPanel} from 'primeng/scrollpanel';
import {RouterLink} from '@angular/router';
import {Divider} from 'primeng/divider';

@Component({
  selector: 'app-transport-categories-menu',
  imports: [
    Panel,
    SearchBarComponent,
    ProgressSpinner,
    Button,
    ScrollPanel,
    RouterLink,
    Divider
  ],
  templateUrl: './transport-categories-menu.component.html',
  styleUrl: './transport-categories-menu.component.scss',
  providers: [TransportCategoriesViewModel]
})
export class TransportCategoriesMenuComponent implements OnInit {
  private readonly _viewModel: TransportCategoriesViewModel;

  constructor(viewModel: TransportCategoriesViewModel, titleService: Title) {
    this._viewModel = viewModel;
    titleService.setTitle('Категории спец. техники')
  }

  public ngOnInit() {
    this._viewModel.initialize();
  }

  public get categories(): TransportCategory[] {
    return this._viewModel.categories;
  }

  public get isLoading(): boolean {
    return this._viewModel.isLoading;
  }

  public routerLink(category: TransportCategory): string {
    return `/transport-catalogue/categories/${category.id}/brands`;
  }
}

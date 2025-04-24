import {Component, OnInit} from '@angular/core';
import {CategoryBrandsViewModelService} from './services/category-brands-viewmodel.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {TransportCategory} from '../transport-categories-menu/types/TransportCategory';
import {CategoryBrand} from './types/category-brand';
import {Button} from 'primeng/button';
import {Panel} from 'primeng/panel';
import {ProgressSpinner} from 'primeng/progressspinner';
import {ScrollPanel} from 'primeng/scrollpanel';
import {SearchBarComponent} from '../../../shared/components/search-bar/search-bar.component';
import {Divider} from 'primeng/divider';

@Component({
  selector: 'app-category-brands-menu',
  imports: [
    Button,
    Panel,
    ProgressSpinner,
    ScrollPanel,
    SearchBarComponent,
    Divider,
    RouterLink
  ],
  templateUrl: './category-brands-menu.component.html',
  styleUrl: './category-brands-menu.component.scss',
  providers: [CategoryBrandsViewModelService]
})
export class CategoryBrandsMenuComponent implements OnInit {
  private readonly _viewModel: CategoryBrandsViewModelService;
  private readonly _activatedRoute: ActivatedRoute;
  private readonly _titleService: Title;

  constructor(viewModel: CategoryBrandsViewModelService, activatedRoute: ActivatedRoute, titleService: Title) {
    this._viewModel = viewModel;
    this._activatedRoute = activatedRoute;
    this._titleService = titleService;
  }

  ngOnInit() {
    this._titleService.setTitle('Бренды');
    this._activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      if (id === null || id === undefined) {
        // do something when id is null or undefined.
        return;
      }
      this._viewModel.initialize(id, this._titleService);
    })
  }

  public get isLoading(): boolean {
    return this._viewModel.isLoading;
  }

  public get category(): TransportCategory {
    return this._viewModel.category;
  }

  public get brands(): CategoryBrand[] {
    return this._viewModel.categoryBrands;
  }

  public routerLink(brand: CategoryBrand): string {
    return `/transport-catalogue/categories/${brand.categoryId}/brands/${brand.brandId}/transports`;
  }
}

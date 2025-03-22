import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

@Component({
  selector: 'app-transport-catalogue-page',
  imports: [
    PageHeaderComponent,
    PanelModule,
    ToolbarModule,
    SearchBarComponent,
  ],
  templateUrl: './transport-catalogue-page.component.html',
  styleUrl: './transport-catalogue-page.component.scss',
})
export class TransportCataloguePageComponent implements OnInit {
  private readonly _httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
  }

  public logSearchText(text: string): void {}

  ngOnInit(): void {
    const urlTree: string = 'http://localhost:5104/api/parsers/AVITO';
    this._httpClient
      .get<any>(urlTree)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.error);
          return new Observable<never>();
        })
      )
      .subscribe((response) => {
        console.log(response);
      });
  }
}

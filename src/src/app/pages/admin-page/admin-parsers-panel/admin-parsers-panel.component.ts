import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { Parser } from '../types/parser';
import { Title } from '@angular/platform-browser';
import { ParsersListComponent } from './parsers-list/parsers-list.component';
import { ProfilesListComponent } from './profiles-list/profiles-list.component';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ParserPanelViewModel } from './services/parsers-panel-viewmodel.service';
import { ParserHttpService } from './services/parser-http.service';
import { Envelope } from '../../../shared/types/Envelope';

@Component({
  selector: 'app-admin-parsers-panel',
  imports: [
    CardModule,
    PanelModule,
    DividerModule,
    ParsersListComponent,
    ProfilesListComponent,
    ProfileInfoComponent,
    InputText,
    Button,
    FormsModule,
  ],
  templateUrl: './admin-parsers-panel.component.html',
  styleUrl: './admin-parsers-panel.component.scss',
  providers: [ParserPanelViewModel],
})
export class AdminParsersPanelComponent implements OnInit {
  public readonly viewModel: ParserPanelViewModel;
  private readonly _httpService: ParserHttpService;
  public constructor(
    viewModel: ParserPanelViewModel,
    httpService: ParserHttpService
  ) {
    this._httpService = httpService;
    this.viewModel = viewModel;
  }

  public ngOnInit(): void {
    this._httpService
      .fetchParsers()
      .subscribe((response: Envelope<Parser[]>) => {
        this.viewModel.parsers = response.data;
      });
  }
}

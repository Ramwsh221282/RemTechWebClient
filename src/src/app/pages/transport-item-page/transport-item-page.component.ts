import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TransportItemFacadeService } from './services/transport-item-facade.service';
import { TransportItemHeaderPanelComponent } from './components/transport-item-header-panel/transport-item-header-panel.component';
import { TransportItemPhotoBlockComponent } from './components/transport-item-photo-block/transport-item-photo-block.component';
import { TransportItemDescriptionBlockComponent } from './components/transport-item-description-block/transport-item-description-block.component';
import { TransportItemCharacteristicsBlockComponent } from './components/transport-item-characteristics-block/transport-item-characteristics-block.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-transport-item-page',
  imports: [
    TransportItemHeaderPanelComponent,
    TransportItemPhotoBlockComponent,
    TransportItemDescriptionBlockComponent,
    TransportItemCharacteristicsBlockComponent,
  ],
  templateUrl: './transport-item-page.component.html',
  styleUrl: './transport-item-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TransportItemFacadeService],
})
export class TransportItemPageComponent implements OnInit {
  private readonly _service: TransportItemFacadeService;
  private readonly _titleService: Title;
  private _id: number = -1;

  public constructor(service: TransportItemFacadeService, titleService: Title) {
    this._service = service;
    this._titleService = titleService;
  }

  public ngOnInit(): void {
    this._service.initialize(this._id, this._titleService);
  }

  @Input()
  public set id(id: string) {
    this._id = Number(id);
  }

  public get id(): number {
    return this._id;
  }
}

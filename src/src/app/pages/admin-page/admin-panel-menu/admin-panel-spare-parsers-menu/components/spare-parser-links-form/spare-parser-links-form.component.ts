import { Component, Input, signal, WritableSignal } from '@angular/core';
import { SpareParser } from '../../models/spare-parser-ts';
import { Button } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { Panel } from 'primeng/panel';
import { ScrollPanel } from 'primeng/scrollpanel';
import { TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { SpareParserLink } from '../../models/spare-parser-link';
import { ParserProfile } from '../../../admin-panel-parsers-menu/types/parser-profile';

@Component({
  selector: 'app-spare-parser-links-form',
  imports: [
    Button,
    FormsModule,
    InputText,
    NgIf,
    Panel,
    ScrollPanel,
    TableModule,
    Toast,
  ],
  templateUrl: './spare-parser-links-form.component.html',
  styleUrl: './spare-parser-links-form.component.scss',
})
export class SpareParserLinksFormComponent {
  @Input({ required: true, alias: 'spareParser' }) set _spareParser(
    parser: SpareParser,
  ) {
    this.parserSignal.set(parser);
    this.parserLinksSignal.set(parser.links);
  }

  readonly parserSignal: WritableSignal<SpareParser | null>;
  readonly parserLinksSignal: WritableSignal<SpareParserLink[]>;

  constructor() {
    this.parserSignal = signal(null);
    this.parserLinksSignal = signal([]);
  }

  public navigateOnLinkSource($event: MouseEvent, link: SpareParserLink): void {
    $event.stopPropagation();
    window.open(link.url);
  }
}

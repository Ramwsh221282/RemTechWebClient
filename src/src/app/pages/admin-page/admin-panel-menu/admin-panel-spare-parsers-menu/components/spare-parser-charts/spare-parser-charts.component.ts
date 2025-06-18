import { Component, Input, signal, WritableSignal } from '@angular/core';
import { ChartStyleInformationFactory } from '../../../admin-panel-parsers-menu/components/parser-charts/services/chart-style.information';
import { SpareParser } from '../../models/spare-parser-ts';
import { Panel } from 'primeng/panel';
import { SpareParsersLastAdvertisementsCountChartComponent } from './spare-parsers-last-advertisements-count-chart/spare-parsers-last-advertisements-count-chart.component';
import { SpareParsersElapsedSecondsChartComponent } from './spare-parsers-elapsed-seconds-chart/spare-parsers-elapsed-seconds-chart.component';

@Component({
  selector: 'app-spare-parser-charts',
  templateUrl: './spare-parser-charts.component.html',
  styleUrl: './spare-parser-charts.component.scss',
  imports: [
    Panel,
    SpareParsersLastAdvertisementsCountChartComponent,
    SpareParsersElapsedSecondsChartComponent,
  ],
})
export class SpareParserChartsComponent {
  @Input({ required: true, alias: 'parser' }) set _parser(parser: SpareParser) {
    const colors = parser.links.map(() =>
      ChartStyleInformationFactory.getRandomColor(),
    );
    this.colorsSignal.set(colors);
    this.parserSignal.set(parser);
  }

  readonly colorsSignal: WritableSignal<string[]>;
  readonly parserSignal: WritableSignal<SpareParser>;

  constructor() {
    this.colorsSignal = signal([]);
    this.parserSignal = signal({
      name: '',
      state: '',
      lastRun: new Date(),
      nextRun: new Date(),
      waitDays: 0,
      links: [],
      lastNewAdvertisementsCount: 0,
    });
  }
}

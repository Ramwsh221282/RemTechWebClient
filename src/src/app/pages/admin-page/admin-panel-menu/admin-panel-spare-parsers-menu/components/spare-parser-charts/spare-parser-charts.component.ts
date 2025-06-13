import { Component, Input, signal, WritableSignal } from '@angular/core';
import { ChartStyleInformationFactory } from '../../../admin-panel-parsers-menu/components/parser-charts/services/chart-style.information';
import { SpareParser } from '../../models/spare-parser-ts';
import { AdvertisementsCountByParsersChartComponent } from '../../../admin-panel-parsers-menu/components/parser-charts/advertisements-count-by-parsers-chart/advertisements-count-by-parsers-chart.component';
import { ElapsedSecondsParserChartComponent } from '../../../admin-panel-parsers-menu/components/parser-charts/elapsed-seconds-parser-chart/elapsed-seconds-parser-chart.component';
import { LastAdvertisementsCountParserChartComponent } from '../../../admin-panel-parsers-menu/components/parser-charts/last-advertisements-count-parser-chart/last-advertisements-count-parser-chart.component';
import { Panel } from 'primeng/panel';
import { SpareParsersLastAdvertisementsCountChartComponent } from './spare-parsers-last-advertisements-count-chart/spare-parsers-last-advertisements-count-chart.component';
import { SpareParserLink } from '../../models/spare-parser-link';
import { SpareParsersElapsedSecondsChartComponent } from './spare-parsers-elapsed-seconds-chart/spare-parsers-elapsed-seconds-chart.component';

@Component({
  selector: 'app-spare-parser-charts',
  templateUrl: './spare-parser-charts.component.html',
  styleUrl: './spare-parser-charts.component.scss',
  imports: [
    AdvertisementsCountByParsersChartComponent,
    ElapsedSecondsParserChartComponent,
    LastAdvertisementsCountParserChartComponent,
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

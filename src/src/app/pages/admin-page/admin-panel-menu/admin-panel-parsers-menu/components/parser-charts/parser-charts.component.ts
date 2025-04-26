import { Component, Input, signal, WritableSignal } from '@angular/core';
import { Parser, ParserFactory } from '../../types/parser';
import { ChartModule } from 'primeng/chart';
import { LastAdvertisementsCountParserChartComponent } from './last-advertisements-count-parser-chart/last-advertisements-count-parser-chart.component';
import { ElapsedSecondsParserChartComponent } from './elapsed-seconds-parser-chart/elapsed-seconds-parser-chart.component';
import { Panel } from 'primeng/panel';
import { AdvertisementsCountByParsersChartComponent } from './advertisements-count-by-parsers-chart/advertisements-count-by-parsers-chart.component';

@Component({
  selector: 'app-parser-charts',
  imports: [
    ChartModule,
    LastAdvertisementsCountParserChartComponent,
    ElapsedSecondsParserChartComponent,
    Panel,
    AdvertisementsCountByParsersChartComponent,
  ],
  templateUrl: './parser-charts.component.html',
  styleUrl: './parser-charts.component.scss',
})
export class ParserChartsComponent {
  @Input({ required: true, alias: 'parser' })
  set _parser(value: Parser) {
    this.parserSignal.set(value);
  }

  readonly parserSignal: WritableSignal<Parser>;

  constructor() {
    this.parserSignal = signal(ParserFactory.empty());
  }
}

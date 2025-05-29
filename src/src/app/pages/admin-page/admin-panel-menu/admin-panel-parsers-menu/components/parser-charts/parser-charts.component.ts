import { Component, Input, signal, WritableSignal } from '@angular/core';
import { Parser, ParserFactory } from '../../types/parser';
import { ChartModule } from 'primeng/chart';
import { LastAdvertisementsCountParserChartComponent } from './last-advertisements-count-parser-chart/last-advertisements-count-parser-chart.component';
import { ElapsedSecondsParserChartComponent } from './elapsed-seconds-parser-chart/elapsed-seconds-parser-chart.component';
import { Panel } from 'primeng/panel';
import { AdvertisementsCountByParsersChartComponent } from './advertisements-count-by-parsers-chart/advertisements-count-by-parsers-chart.component';
import { ChartStyleInformationFactory } from './services/chart-style.information';

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
  @Input({ required: true, alias: 'parsers' }) set _parsers(parsers: Parser[]) {
    this.parsersSignal.set(parsers);
  }

  @Input({ required: true, alias: 'parser' })
  set _parser(value: Parser) {
    this.parserSignal.set(value);
    this.colorsSignal.set(
      value.links.map(() => ChartStyleInformationFactory.getRandomColor()),
    );
  }

  readonly parsersSignal: WritableSignal<Parser[]>;
  readonly parserSignal: WritableSignal<Parser>;
  readonly colorsSignal: WritableSignal<string[]>;

  constructor() {
    this.parsersSignal = signal([]);
    this.parserSignal = signal(ParserFactory.empty());
    this.colorsSignal = signal([]);
  }
}

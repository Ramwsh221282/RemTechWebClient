import {
  ChangeDetectorRef,
  Component,
  computed,
  Input,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  ChartStyleInformation,
  ChartStyleInformationFactory,
} from '../services/chart-style.information';
import { UIChart } from 'primeng/chart';
import { Parser } from '../../../types/parser';

interface ParserLinkChartItem {
  label: string;
  count: number;
}

interface ParserLinkChartData {
  labels: string[];
  counts: number[];
}

@Component({
  selector: 'app-advertisements-count-by-parsers-chart',
  imports: [UIChart],
  templateUrl: './advertisements-count-by-parsers-chart.component.html',
  styleUrl: './advertisements-count-by-parsers-chart.component.scss',
})
export class AdvertisementsCountByParsersChartComponent {
  @Input({ required: true, alias: 'parsers' }) set _parsers(value: Parser[]) {
    this.parsersSignal.set(value);
  }

  @Input({ required: true, alias: 'colors' }) set _colors(value: string[]) {
    this.colorsSignal.set(value);
  }

  readonly colorsSignal: WritableSignal<string[]> = signal([]);
  readonly parsersSignal: WritableSignal<Parser[]> = signal([]);

  readonly parserChartDataItemsSignal: Signal<ParserLinkChartItem[]> = computed(
    (): ParserLinkChartItem[] => {
      const data: Parser[] = this.parsersSignal();
      return data.map((item: Parser): ParserLinkChartItem => {
        return {
          label: item.name,
          count: item.lastNewAdvertisementsCount,
        };
      });
    },
  );

  readonly parserChartDataSignal: Signal<ParserLinkChartData> = computed(
    (): ParserLinkChartData => {
      const items: ParserLinkChartItem[] = this.parserChartDataItemsSignal();
      const labels: string[] = items.map((item) => item.label);
      const counts: number[] = items.map((item) => item.count);
      return { labels: labels, counts: counts };
    },
  );

  readonly chartStyleInformationSignal: Signal<ChartStyleInformation> =
    computed((): ChartStyleInformation => {
      return ChartStyleInformationFactory.createChartStyleInformation();
    });
  
  readonly chartData = computed(() => {
    return {
      labels: this.parserChartDataSignal().labels,
      datasets: [
        {
          label: 'Количество объявлений по парсерам',
          data: this.parserChartDataSignal().counts,
          borderWidth: 1,
          backgroundColor: this.colorsSignal(),
        },
      ],
    };
  });
  readonly chartOptions = computed(() => {
    const chartStyleInformation: ChartStyleInformation =
      this.chartStyleInformationSignal();
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: chartStyleInformation.primaryTextColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: chartStyleInformation.secondaryTextColor,
          },
          grid: {
            color: chartStyleInformation.surfaceBorder,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: chartStyleInformation.secondaryTextColor,
          },
          grid: {
            color: chartStyleInformation.surfaceBorder,
          },
        },
      },
    };
    this._cd.markForCheck();
    return options;
  });

  private readonly _cd;

  constructor(cd: ChangeDetectorRef) {
    this._cd = cd;
    this.colorsSignal = signal([]);
  }
}

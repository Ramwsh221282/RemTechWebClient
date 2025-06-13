import {
  ChangeDetectorRef,
  Component,
  computed,
  Input,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { SpareParser } from '../../../models/spare-parser-ts';
import {
  ChartDataItem,
  ChartItem,
} from '../../../../admin-panel-analytics-menu/types/chart-item.interface';
import { SpareParserLink } from '../../../models/spare-parser-link';
import {
  ChartStyleInformation,
  ChartStyleInformationFactory,
} from '../../../../admin-panel-parsers-menu/components/parser-charts/services/chart-style.information';
import { UIChart } from 'primeng/chart';

@Component({
  selector: 'app-spare-parsers-last-advertisements-count-chart',
  imports: [UIChart],
  templateUrl: './spare-parsers-last-advertisements-count-chart.component.html',
  styleUrl: './spare-parsers-last-advertisements-count-chart.component.scss',
})
export class SpareParsersLastAdvertisementsCountChartComponent {
  @Input({ required: true, alias: 'parser' })
  set _parser(value: SpareParser) {
    this.parserSignal.set(value);
  }

  @Input({ required: true, alias: 'colors' })
  set _colorsSignal(colors: string[]) {
    this.colorsSignal.set(colors);
  }

  readonly parserSignal: WritableSignal<SpareParser>;
  readonly colorsSignal: WritableSignal<string[]>;
  readonly parserChartDataItemsSignal: Signal<ChartItem[]> = computed(
    (): ChartItem[] => {
      const links: SpareParserLink[] = this.parserSignal().links;
      return links.map((profile: SpareParserLink): ChartItem => {
        return {
          label: profile.name,
          numeric: profile.lastNewAdvertisementsCount,
        };
      });
    },
  );
  readonly parserChartDataSignal: Signal<ChartDataItem> = computed(
    (): ChartDataItem => {
      const items: ChartItem[] = this.parserChartDataItemsSignal();
      const labels: string[] = items.map(
        (item: ChartItem): string => item.label,
      );
      const seconds: number[] = items.map(
        (item: ChartItem): number => item.numeric,
      );
      return { labels: labels, numerics: seconds };
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
          label: 'Время парсинга (секунды)',
          data: this.parserChartDataSignal().numerics,
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
      indexAxis: 'y',
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
    this.parserSignal = signal({
      links: [],
      lastRun: new Date(),
      nextRun: new Date(),
      name: '',
      waitDays: 0,
      lastNewAdvertisementsCount: 0,
      state: '',
    });
    this._cd = cd;
    this.colorsSignal = signal([]);
  }
}

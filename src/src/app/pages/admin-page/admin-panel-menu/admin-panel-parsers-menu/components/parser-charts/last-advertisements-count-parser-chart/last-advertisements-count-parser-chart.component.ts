import {
  ChangeDetectorRef,
  Component,
  computed,
  Input,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { UIChart } from 'primeng/chart';
import { Parser, ParserFactory } from '../../../types/parser';
import { ParserProfile } from '../../../types/parser-profile';
import {
  ChartStyleInformation,
  ChartStyleInformationFactory,
} from '../services/chart-style.information';

interface ParserLinkChartItem {
  label: string;
  lastNewAdvertisementsCount: number;
}

interface ParserLinkChartData {
  labels: string[];
  counts: number[];
}

@Component({
  selector: 'app-last-advertisements-count-parser-chart',
  imports: [UIChart],
  templateUrl: './last-advertisements-count-parser-chart.component.html',
  styleUrl: './last-advertisements-count-parser-chart.component.scss',
})
export class LastAdvertisementsCountParserChartComponent {
  @Input({ required: true, alias: 'parser' })
  set _parser(value: Parser) {
    this.parserSignal.set(value);
  }

  readonly parserSignal: WritableSignal<Parser>;
  readonly parserChartDataItemsSignal: Signal<ParserLinkChartItem[]> = computed(
    (): ParserLinkChartItem[] => {
      const profiles: ParserProfile[] = this.parserSignal().profiles;
      return profiles.map((profile: ParserProfile): ParserLinkChartItem => {
        return {
          label: profile.name,
          lastNewAdvertisementsCount: profile.lastNewAdvertisementsCount,
        };
      });
    },
  );
  readonly parserChartDataSignal: Signal<ParserLinkChartData> = computed(
    (): ParserLinkChartData => {
      const items: ParserLinkChartItem[] = this.parserChartDataItemsSignal();
      const labels: string[] = items.map((item) => item.label);
      const counts: number[] = items.map(
        (item) => item.lastNewAdvertisementsCount,
      );
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
          label: 'Последние новые объявления',
          data: this.parserChartDataSignal().counts,
          borderWidth: 1,
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
    this.parserSignal = signal(ParserFactory.empty());
    this._cd = cd;
  }
}

import {
  ChangeDetectorRef,
  Component,
  computed,
  Input,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { Parser, ParserFactory } from '../../../types/parser';
import { ParserProfile } from '../../../types/parser-profile';
import {
  ChartStyleInformation,
  ChartStyleInformationFactory,
} from '../services/chart-style.information';
import { UIChart } from 'primeng/chart';

interface ParserLinkChartItem {
  label: string;
  elapsedSeconds: number;
}

interface ParserLinkChartData {
  labels: string[];
  seconds: number[];
}

@Component({
  selector: 'app-elapsed-seconds-parser-chart',
  imports: [UIChart],
  templateUrl: './elapsed-seconds-parser-chart.component.html',
  styleUrl: './elapsed-seconds-parser-chart.component.scss',
})
export class ElapsedSecondsParserChartComponent {
  @Input({ required: true, alias: 'parser' })
  set _parser(value: Parser) {
    this.parserSignal.set(value);
  }

  @Input({ required: true, alias: 'colors' })
  set _colorsSignal(colors: string[]) {
    this.colorsSignal.set(colors);
  }

  readonly parserSignal: WritableSignal<Parser>;
  readonly colorsSignal: WritableSignal<string[]>;
  readonly parserChartDataItemsSignal: Signal<ParserLinkChartItem[]> = computed(
    (): ParserLinkChartItem[] => {
      const profiles: ParserProfile[] = this.parserSignal().profiles;
      return profiles.map((profile: ParserProfile): ParserLinkChartItem => {
        return {
          label: profile.name,
          elapsedSeconds: profile.totalElapsedSeconds,
        };
      });
    },
  );
  readonly parserChartDataSignal: Signal<ParserLinkChartData> = computed(
    (): ParserLinkChartData => {
      const items: ParserLinkChartItem[] = this.parserChartDataItemsSignal();
      const labels: string[] = items.map(
        (item: ParserLinkChartItem): string => item.label,
      );
      const seconds: number[] = items.map(
        (item: ParserLinkChartItem): number => item.elapsedSeconds,
      );
      return { labels: labels, seconds: seconds };
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
          data: this.parserChartDataSignal().seconds,
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
    this.parserSignal = signal(ParserFactory.empty());
    this._cd = cd;
    this.colorsSignal = signal([]);
  }
}

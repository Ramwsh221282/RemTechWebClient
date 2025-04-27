import {
  ChangeDetectorRef,
  Component,
  computed,
  Input,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { AdvertisementsCountByParsers } from '../../../types/advertisements-count-by-parsers';
import { ParsersHttpService } from '../../../services/parsers-http.service';
import {
  ChartStyleInformation,
  ChartStyleInformationFactory,
} from '../services/chart-style.information';
import { UIChart } from 'primeng/chart';

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
export class AdvertisementsCountByParsersChartComponent implements OnInit {
  private readonly _httpService: ParsersHttpService;
  readonly advertisementsCountByParsersSignal: WritableSignal<
    AdvertisementsCountByParsers[]
  >;

  readonly parserChartDataItemsSignal: Signal<ParserLinkChartItem[]> = computed(
    (): ParserLinkChartItem[] => {
      const data: AdvertisementsCountByParsers[] =
        this.advertisementsCountByParsersSignal();
      return data.map(
        (item: AdvertisementsCountByParsers): ParserLinkChartItem => {
          return {
            label: item.parserName,
            count: item.advertisementsCount,
          };
        },
      );
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

  readonly colorsSignal: WritableSignal<string[]>;

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

  constructor(httpService: ParsersHttpService, cd: ChangeDetectorRef) {
    this.advertisementsCountByParsersSignal = signal([]);
    this._cd = cd;
    this._httpService = httpService;
    this.colorsSignal = signal([]);
  }

  public ngOnInit() {
    this._httpService.getAdvertisementsCountByParsers().subscribe((result) => {
      if (result.code === 200) {
        this.advertisementsCountByParsersSignal.set(result.data);
        this.colorsSignal.set(
          result.data.map(() => ChartStyleInformationFactory.getRandomColor()),
        );
      }
    });
  }
}

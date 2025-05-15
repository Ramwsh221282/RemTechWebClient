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
  StatisticalCategoryBrand,
  StatisticalCategoryBrandGeo,
} from '../types/statistical-category';
import {
  ChartStyleInformation,
  ChartStyleInformationFactory,
} from '../../admin-panel-parsers-menu/components/parser-charts/services/chart-style.information';
import { ChartDataItem, ChartItem } from '../types/chart-item.interface';
import { UIChart } from 'primeng/chart';

@Component({
  selector: 'app-brand-geo-charts',
  imports: [UIChart],
  templateUrl: './brand-geo-charts.component.html',
  styleUrl: './brand-geo-charts.component.scss',
})
export class BrandGeoChartsComponent {
  @Input({ required: true, alias: 'brandGeos' })
  set _brandGeos(value: StatisticalCategoryBrandGeo[]) {
    console.log(value);
    this.brandGeos.set(value);
    this.colors.set(
      value.map(() => ChartStyleInformationFactory.getRandomColor()),
    );
  }

  readonly brandGeos: WritableSignal<StatisticalCategoryBrandGeo[]>;
  readonly colors: WritableSignal<string[]>;

  readonly geoBrandsCount: Signal<ChartItem[]> = computed((): ChartItem[] => {
    return this.brandGeos().map(
      (geo: StatisticalCategoryBrandGeo): ChartItem => {
        return {
          label: geo.geoName,
          numeric: geo.data.count,
        };
      },
    );
  });

  readonly geoBrandsPriceMax: Signal<ChartItem[]> = computed(
    (): ChartItem[] => {
      return this.brandGeos().map(
        (geo: StatisticalCategoryBrandGeo): ChartItem => {
          return {
            label: geo.geoName,
            numeric: geo.data.maximum,
          };
        },
      );
    },
  );

  readonly geoBrandsPriceMin: Signal<ChartItem[]> = computed(
    (): ChartItem[] => {
      return this.brandGeos().map(
        (geo: StatisticalCategoryBrandGeo): ChartItem => {
          return {
            label: geo.geoName,
            numeric: geo.data.minimal,
          };
        },
      );
    },
  );

  readonly geoBrandsPriceAverage: Signal<ChartItem[]> = computed(
    (): ChartItem[] => {
      return this.brandGeos().map(
        (geo: StatisticalCategoryBrandGeo): ChartItem => {
          return {
            label: geo.geoName,
            numeric: geo.data.average,
          };
        },
      );
    },
  );

  readonly geoChartDataCounts = computed((): ChartDataItem => {
    const items: ChartItem[] = this.geoBrandsCount();
    const labels: string[] = items.map((item: ChartItem): string => item.label);
    const numerics: number[] = items.map(
      (item: ChartItem): number => item.numeric,
    );
    return { labels: labels, numerics: numerics };
  });

  readonly geoChartDataPricesMax = computed((): ChartDataItem => {
    const items: ChartItem[] = this.geoBrandsPriceMax();
    const labels: string[] = items.map((item: ChartItem): string => item.label);
    const numerics: number[] = items.map(
      (item: ChartItem): number => item.numeric,
    );
    return { labels: labels, numerics: numerics };
  });

  readonly geoChartDataPricesMin = computed((): ChartDataItem => {
    const items: ChartItem[] = this.geoBrandsPriceMin();
    const labels: string[] = items.map((item: ChartItem): string => item.label);
    const numerics: number[] = items.map(
      (item: ChartItem): number => item.numeric,
    );
    return { labels: labels, numerics: numerics };
  });

  readonly geoChartDataPricesAvg = computed((): ChartDataItem => {
    const items: ChartItem[] = this.geoBrandsPriceAverage();
    const labels: string[] = items.map((item: ChartItem): string => item.label);
    const numerics: number[] = items.map(
      (item: ChartItem): number => item.numeric,
    );
    return { labels: labels, numerics: numerics };
  });

  readonly geoCountsChartData = computed(() => {
    const countsData = this.geoChartDataCounts();
    const colors = this.colors();
    return {
      labels: countsData.labels,
      datasets: [
        {
          label: 'Число объявлений по регионам бренда',
          data: countsData.numerics,
          borderWidth: 1,
          backgroundColor: colors,
        },
      ],
    };
  });

  readonly geoPricesMaxChartData = computed(() => {
    const pricesMaxData = this.geoChartDataPricesMax();
    const colors = this.colors();
    return {
      labels: pricesMaxData.labels,
      datasets: [
        {
          label: 'Максимальные цены по регионам бренда',
          data: pricesMaxData.numerics,
          borderWidth: 1,
          backgroundColor: colors,
        },
      ],
    };
  });

  readonly geoPricesMinChartData = computed(() => {
    const pricesMinData = this.geoChartDataPricesMin();
    const colors = this.colors();
    return {
      labels: pricesMinData.labels,
      datasets: [
        {
          label: 'Минимальные цены по регионам бренда',
          data: pricesMinData.numerics,
          borderWidth: 1,
          backgroundColor: colors,
        },
      ],
    };
  });

  readonly geoPricesAvgChartData = computed(() => {
    const pricesAvgData = this.geoChartDataPricesAvg();
    const colors = this.colors();
    return {
      labels: pricesAvgData.labels,
      datasets: [
        {
          label: 'Средние цены по регионам бренда',
          data: pricesAvgData.numerics,
          borderWidth: 1,
          backgroundColor: colors,
        },
      ],
    };
  });

  readonly chartStyleInformationSignal: Signal<ChartStyleInformation> =
    computed((): ChartStyleInformation => {
      return ChartStyleInformationFactory.createChartStyleInformation();
    });

  readonly chartOptions = computed(() => {
    const chartStyleInformation: ChartStyleInformation =
      this.chartStyleInformationSignal();
    const options = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.5,
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

  private readonly _cd: ChangeDetectorRef;

  constructor(cd: ChangeDetectorRef) {
    this._cd = cd;
    this.brandGeos = signal([]);
    this.colors = signal([]);
  }
}

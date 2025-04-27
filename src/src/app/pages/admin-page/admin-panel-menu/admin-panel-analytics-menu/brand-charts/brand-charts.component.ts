import {
  ChangeDetectorRef,
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { StatisticalCategoryBrand } from '../types/statistical-category';
import { ChartDataItem, ChartItem } from '../types/chart-item.interface';
import {
  ChartStyleInformation,
  ChartStyleInformationFactory,
} from '../../admin-panel-parsers-menu/components/parser-charts/services/chart-style.information';
import { UIChart } from 'primeng/chart';

@Component({
  selector: 'app-brand-charts',
  imports: [UIChart],
  templateUrl: './brand-charts.component.html',
  styleUrl: './brand-charts.component.scss',
})
export class BrandChartsComponent {
  @Output() brandSelected: EventEmitter<string>;

  @Input({ required: true, alias: 'brandsOfSelectedCategory' })
  set _brandsOfSelectedCategory(value: StatisticalCategoryBrand[]) {
    this.brandsSignal.set(value);
  }

  readonly brandsSignal: WritableSignal<StatisticalCategoryBrand[]>;

  readonly categoryBrandCounts: Signal<ChartItem[]> = computed(
    (): ChartItem[] => {
      return this.brandsSignal().map(
        (brand: StatisticalCategoryBrand): ChartItem => {
          return {
            label: brand.brandName,
            numeric: brand.data.count,
          };
        },
      );
    },
  );

  readonly categoryBrandPricesMax: Signal<ChartItem[]> = computed(
    (): ChartItem[] => {
      return this.brandsSignal().map(
        (brand: StatisticalCategoryBrand): ChartItem => {
          return {
            label: brand.brandName,
            numeric: brand.data.maximum,
          };
        },
      );
    },
  );

  readonly categoryBrandPricesMin: Signal<ChartItem[]> = computed(
    (): ChartItem[] => {
      return this.brandsSignal().map(
        (brand: StatisticalCategoryBrand): ChartItem => {
          return {
            label: brand.brandName,
            numeric: brand.data.minimal,
          };
        },
      );
    },
  );

  readonly categoryBrandPricesAverage: Signal<ChartItem[]> = computed(
    (): ChartItem[] => {
      return this.brandsSignal().map(
        (brand: StatisticalCategoryBrand): ChartItem => {
          return {
            label: brand.brandName,
            numeric: brand.data.average,
          };
        },
      );
    },
  );

  readonly categoryChartDataCounts = computed((): ChartDataItem => {
    const items: ChartItem[] = this.categoryBrandCounts();
    const labels: string[] = items.map((item: ChartItem): string => item.label);
    const numerics: number[] = items.map(
      (item: ChartItem): number => item.numeric,
    );
    return { labels: labels, numerics: numerics };
  });

  readonly colorsSignal = computed((): string[] => {
    const countSignal = this.categoryChartDataCounts();
    return countSignal.labels.map(() =>
      ChartStyleInformationFactory.getRandomColor(),
    );
  });

  readonly categoryChartDataPricesMax = computed((): ChartDataItem => {
    const items: ChartItem[] = this.categoryBrandPricesMax();
    const labels: string[] = items.map((item: ChartItem): string => item.label);
    const numerics: number[] = items.map(
      (item: ChartItem): number => item.numeric,
    );
    return { labels: labels, numerics: numerics };
  });

  readonly categoryChartDataPricesMin = computed((): ChartDataItem => {
    const items: ChartItem[] = this.categoryBrandPricesMin();
    const labels: string[] = items.map((item: ChartItem): string => item.label);
    const numerics: number[] = items.map(
      (item: ChartItem): number => item.numeric,
    );
    return { labels: labels, numerics: numerics };
  });

  readonly categoryChartDataPricesAvg = computed((): ChartDataItem => {
    const items: ChartItem[] = this.categoryBrandPricesAverage();
    const labels: string[] = items.map((item: ChartItem): string => item.label);
    const numerics: number[] = items.map(
      (item: ChartItem): number => item.numeric,
    );
    return { labels: labels, numerics: numerics };
  });

  readonly chartStyleInformationSignal: Signal<ChartStyleInformation> =
    computed((): ChartStyleInformation => {
      return ChartStyleInformationFactory.createChartStyleInformation();
    });

  readonly countsChartData = computed(() => {
    const countsData = this.categoryChartDataCounts();
    const colors = this.colorsSignal();
    return {
      labels: countsData.labels,
      datasets: [
        {
          label: 'Число объявлений по брендам категории',
          data: countsData.numerics,
          borderWidth: 1,
          backgroundColor: colors,
        },
      ],
    };
  });

  readonly pricesMaxChartData = computed(() => {
    const pricesMaxData = this.categoryChartDataPricesMax();
    const colors = this.colorsSignal();
    return {
      labels: pricesMaxData.labels,
      datasets: [
        {
          label: 'Максимальные цены по брендам категории',
          data: pricesMaxData.numerics,
          borderWidth: 1,
          backgroundColor: colors,
        },
      ],
    };
  });

  readonly pricesMinChartData = computed(() => {
    const pricesMinData = this.categoryChartDataPricesMin();
    const colors = this.colorsSignal();
    return {
      labels: pricesMinData.labels,
      datasets: [
        {
          label: 'Минимальные цены по брендам категории',
          data: pricesMinData.numerics,
          borderWidth: 1,
          backgroundColor: colors,
        },
      ],
    };
  });

  readonly pricesAvgChartData = computed(() => {
    const pricesAvgData = this.categoryChartDataPricesAvg();
    const colors = this.colorsSignal();
    return {
      labels: pricesAvgData.labels,
      datasets: [
        {
          label: 'Средние цены по брендам категории',
          data: pricesAvgData.numerics,
          borderWidth: 1,
          backgroundColor: colors,
        },
      ],
    };
  });

  readonly chartOptions = computed(() => {
    const chartStyleInformation: ChartStyleInformation =
      this.chartStyleInformationSignal();
    const options = {
      indexAxis: 'x',
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

  private readonly _cd: ChangeDetectorRef;

  public dataItemSelected(dataItem: any): void {
    const selectedIndex: number = dataItem.element.index;
    const items: ChartItem[] = this.categoryBrandCounts();
    const item = items[selectedIndex];
    const label = item.label;
    this.brandSelected.emit(label);
  }

  constructor(cd: ChangeDetectorRef) {
    this._cd = cd;
    this.brandsSignal = signal([]);
    this.brandSelected = new EventEmitter();
  }
}

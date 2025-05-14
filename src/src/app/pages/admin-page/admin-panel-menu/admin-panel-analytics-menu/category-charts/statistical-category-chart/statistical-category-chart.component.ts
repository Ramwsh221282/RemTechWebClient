import {
  ChangeDetectorRef,
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { StatisticalCategory } from '../../types/statistical-category';
import {
  ChartStyleInformation,
  ChartStyleInformationFactory,
} from '../../../admin-panel-parsers-menu/components/parser-charts/services/chart-style.information';
import { UIChart } from 'primeng/chart';
import { ChartDataItem, ChartItem } from '../../types/chart-item.interface';

@Component({
  selector: 'app-statistical-category-chart',
  imports: [UIChart],
  templateUrl: './statistical-category-chart.component.html',
  styleUrl: './statistical-category-chart.component.scss',
})
export class StatisticalCategoryChartComponent {
  @Output() categoryNameSelected: EventEmitter<string>;

  @Input({ required: true, alias: 'categories' })
  set _categories(value: StatisticalCategory[]) {
    this.categoriesSignal.set(value);
    this.colorsSignal.set(
      value.map(() => ChartStyleInformationFactory.getRandomColor()),
    );
  }

  readonly categoriesSignal: WritableSignal<StatisticalCategory[]>;
  readonly colorsSignal: WritableSignal<string[]>;

  readonly categoryChartCounts: Signal<ChartItem[]> = computed(
    (): ChartItem[] => {
      return this.categoriesSignal().map(
        (category: StatisticalCategory): ChartItem => {
          return { label: category.name, numeric: category.data.count };
        },
      );
    },
  );

  readonly categoryChartPricesMax: Signal<ChartItem[]> = computed(
    (): ChartItem[] => {
      return this.categoriesSignal().map(
        (category: StatisticalCategory): ChartItem => {
          return { label: category.name, numeric: category.data.maximum };
        },
      );
    },
  );

  readonly categoryChartPricesMin: Signal<ChartItem[]> = computed(
    (): ChartItem[] => {
      return this.categoriesSignal().map(
        (category: StatisticalCategory): ChartItem => {
          return { label: category.name, numeric: category.data.minimal };
        },
      );
    },
  );

  readonly categoryChartPricesAvg: Signal<ChartItem[]> = computed(
    (): ChartItem[] => {
      return this.categoriesSignal().map(
        (category: StatisticalCategory): ChartItem => {
          return { label: category.name, numeric: category.data.average };
        },
      );
    },
  );

  readonly categoryChartDataCounts = computed((): ChartDataItem => {
    const items: ChartItem[] = this.categoryChartCounts();
    const labels: string[] = items.map((item: ChartItem): string => item.label);
    const numerics: number[] = items.map(
      (item: ChartItem): number => item.numeric,
    );
    return { labels: labels, numerics: numerics };
  });

  readonly categoryChartDataPricesMax = computed((): ChartDataItem => {
    const items: ChartItem[] = this.categoryChartPricesMax();
    const labels: string[] = items.map((item: ChartItem): string => item.label);
    const numerics: number[] = items.map(
      (item: ChartItem): number => item.numeric,
    );
    return { labels: labels, numerics: numerics };
  });

  readonly categoryChartDataPricesMin = computed((): ChartDataItem => {
    const items: ChartItem[] = this.categoryChartPricesMin();
    const labels: string[] = items.map((item: ChartItem): string => item.label);
    const numerics: number[] = items.map(
      (item: ChartItem): number => item.numeric,
    );
    return { labels: labels, numerics: numerics };
  });

  readonly categoryChartDataPricesAvg = computed((): ChartDataItem => {
    const items: ChartItem[] = this.categoryChartPricesAvg();
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

  private readonly _cd: ChangeDetectorRef;

  readonly countsChartData = computed(() => {
    const countsData = this.categoryChartDataCounts();
    const colors = this.colorsSignal();
    return {
      labels: countsData.labels,
      datasets: [
        {
          label: 'Число объявлений по категориям',
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
          label: 'Максимальные цены по категориям',
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
          label: 'Минимальные цены по категориям',
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
          label: 'Средние цены по категориям',
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

  public dataItemSelected(dataItem: any): void {
    const selectedIndex: number = dataItem.element.index;
    const items: ChartItem[] = this.categoryChartCounts();
    const item = items[selectedIndex];
    const label = item.label;
    this.categoryNameSelected.emit(label);
  }

  constructor(cd: ChangeDetectorRef) {
    this.categoriesSignal = signal([]);
    this.categoryNameSelected = new EventEmitter<string>();
    this._cd = cd;
    this.colorsSignal = signal([]);
  }
}

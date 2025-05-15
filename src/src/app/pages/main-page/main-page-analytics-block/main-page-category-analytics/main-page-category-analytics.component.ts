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
import { StatisticalCategory } from '../../../admin-page/admin-panel-menu/admin-panel-analytics-menu/types/statistical-category';
import {
  ChartStyleInformation,
  ChartStyleInformationFactory,
} from '../../../admin-page/admin-panel-menu/admin-panel-parsers-menu/components/parser-charts/services/chart-style.information';
import {
  ChartDataItem,
  ChartItem,
} from '../../../admin-page/admin-panel-menu/admin-panel-analytics-menu/types/chart-item.interface';
import { UIChart } from 'primeng/chart';

@Component({
  selector: 'app-main-page-category-analytics',
  imports: [UIChart],
  templateUrl: './main-page-category-analytics.component.html',
  styleUrl: './main-page-category-analytics.component.scss',
})
export class MainPageCategoryAnalyticsComponent {
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

  readonly categoryChartDataCounts = computed((): ChartDataItem => {
    const items: ChartItem[] = this.categoryChartCounts();
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

  readonly chartOptions = computed(() => {
    const chartStyleInformation: ChartStyleInformation =
      this.chartStyleInformationSignal();
    const options = {
      indexAxis: 'x',
      maintainAspectRatio: false,
      aspectRatio: 0.5,
      plugins: {
        legend: {
          position: 'top',
          type: 'line',
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
            display: false,
          },
          title: {
            display: false,
          },
          display: false,
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: chartStyleInformation.secondaryTextColor,
          },
          grid: {
            color: chartStyleInformation.surfaceBorder,
            display: false,
          },
          title: {
            display: false,
          },
          display: false,
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

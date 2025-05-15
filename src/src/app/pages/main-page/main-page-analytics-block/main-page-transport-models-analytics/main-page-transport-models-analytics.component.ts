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
import {
  StatisticalCategoryBrand,
  StatisticalTransportModel,
} from '../../../admin-page/admin-panel-menu/admin-panel-analytics-menu/types/statistical-category';
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
  selector: 'app-main-page-transport-models-analytics',
  imports: [UIChart],
  templateUrl: './main-page-transport-models-analytics.component.html',
  styleUrl: './main-page-transport-models-analytics.component.scss',
})
export class MainPageTransportModelsAnalyticsComponent {
  @Output() categoryNameSelected: EventEmitter<string>;

  @Input({ required: true, alias: 'models' })
  set _models(value: StatisticalTransportModel[]) {
    this.modelsSignal.set(value);
    this.colorsSignal.set(
      value.map(() => ChartStyleInformationFactory.getRandomColor()),
    );
  }

  readonly modelsSignal: WritableSignal<StatisticalTransportModel[]>;
  readonly colorsSignal: WritableSignal<string[]>;

  readonly categoryChartCounts: Signal<ChartItem[]> = computed(
    (): ChartItem[] => {
      return this.modelsSignal().map(
        (model: StatisticalTransportModel): ChartItem => {
          return { label: model.model, numeric: model.data.count };
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
          label: `МОДЕЛИ`,
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
      indexAxis: 'y',
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
          },
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
    this.modelsSignal = signal([]);
    this.categoryNameSelected = new EventEmitter<string>();
    this._cd = cd;
    this.colorsSignal = signal([]);
  }
}

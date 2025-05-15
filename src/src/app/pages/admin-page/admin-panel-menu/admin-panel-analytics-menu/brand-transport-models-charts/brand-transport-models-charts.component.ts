import {
  ChangeDetectorRef,
  Component,
  computed,
  Input,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { StatisticalTransportModel } from '../types/statistical-category';
import {
  ChartStyleInformation,
  ChartStyleInformationFactory,
} from '../../admin-panel-parsers-menu/components/parser-charts/services/chart-style.information';
import { ChartDataItem, ChartItem } from '../types/chart-item.interface';
import { UIChart } from 'primeng/chart';

@Component({
  selector: 'app-brand-transport-models-charts',
  imports: [UIChart],
  templateUrl: './brand-transport-models-charts.component.html',
  styleUrl: './brand-transport-models-charts.component.scss',
})
export class BrandTransportModelsChartsComponent {
  @Input({ required: true, alias: 'models' })
  set _models(value: StatisticalTransportModel[]) {
    this.models.set(value);
    this.colors.set(
      value.map(() => ChartStyleInformationFactory.getRandomColor()),
    );
  }

  readonly models: WritableSignal<StatisticalTransportModel[]>;
  readonly colors: WritableSignal<string[]>;

  readonly modelsCount: Signal<ChartItem[]> = computed((): ChartItem[] => {
    return this.models().map((model: StatisticalTransportModel): ChartItem => {
      return {
        label: model.model,
        numeric: model.data.count,
      };
    });
  });

  readonly modelsPriceMax: Signal<ChartItem[]> = computed((): ChartItem[] => {
    return this.models().map((model: StatisticalTransportModel): ChartItem => {
      return {
        label: model.model,
        numeric: model.data.maximum,
      };
    });
  });

  readonly modelsPriceMin: Signal<ChartItem[]> = computed((): ChartItem[] => {
    return this.models().map((model: StatisticalTransportModel): ChartItem => {
      return {
        label: model.model,
        numeric: model.data.minimal,
      };
    });
  });

  readonly modelsPriceAverage: Signal<ChartItem[]> = computed(
    (): ChartItem[] => {
      return this.models().map(
        (model: StatisticalTransportModel): ChartItem => {
          return {
            label: model.model,
            numeric: model.data.average,
          };
        },
      );
    },
  );

  readonly modelsDataCounts = computed((): ChartDataItem => {
    const items: ChartItem[] = this.modelsCount();
    const labels: string[] = items.map((item: ChartItem): string => item.label);
    const numerics: number[] = items.map(
      (item: ChartItem): number => item.numeric,
    );
    return { labels: labels, numerics: numerics };
  });

  readonly modelsDataPricesMax = computed((): ChartDataItem => {
    const items: ChartItem[] = this.modelsPriceMax();
    const labels: string[] = items.map((item: ChartItem): string => item.label);
    const numerics: number[] = items.map(
      (item: ChartItem): number => item.numeric,
    );
    return { labels: labels, numerics: numerics };
  });

  readonly modelsPricesMin = computed((): ChartDataItem => {
    const items: ChartItem[] = this.modelsPriceMin();
    const labels: string[] = items.map((item: ChartItem): string => item.label);
    const numerics: number[] = items.map(
      (item: ChartItem): number => item.numeric,
    );
    return { labels: labels, numerics: numerics };
  });

  readonly modelsPricesAvg = computed((): ChartDataItem => {
    const items: ChartItem[] = this.modelsPriceAverage();
    const labels: string[] = items.map((item: ChartItem): string => item.label);
    const numerics: number[] = items.map(
      (item: ChartItem): number => item.numeric,
    );
    return { labels: labels, numerics: numerics };
  });

  readonly modelsCountChartData = computed(() => {
    const countsData = this.modelsDataCounts();
    const colors = this.colors();
    return {
      labels: countsData.labels,
      datasets: [
        {
          label: 'Число объявлений по моделям бренда',
          data: countsData.numerics,
          borderWidth: 1,
          backgroundColor: colors,
        },
      ],
    };
  });

  readonly modelsPricesMaxChartData = computed(() => {
    const pricesMaxData = this.modelsDataPricesMax();
    const colors = this.colors();
    return {
      labels: pricesMaxData.labels,
      datasets: [
        {
          label: 'Максимальные цены по моделям бренда',
          data: pricesMaxData.numerics,
          borderWidth: 1,
          backgroundColor: colors,
        },
      ],
    };
  });

  readonly modelsPricesMinChartData = computed(() => {
    const pricesMinData = this.modelsPricesMin();
    const colors = this.colors();
    return {
      labels: pricesMinData.labels,
      datasets: [
        {
          label: 'Минимальные цены по моделям бренда',
          data: pricesMinData.numerics,
          borderWidth: 1,
          backgroundColor: colors,
        },
      ],
    };
  });

  readonly modelsPricesAvgChartData = computed(() => {
    const pricesAvgData = this.modelsPricesAvg();
    const colors = this.colors();
    return {
      labels: pricesAvgData.labels,
      datasets: [
        {
          label: 'Средние цены по моделям бренда',
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
    this.models = signal([]);
    this.colors = signal([]);
  }
}

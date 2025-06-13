import {
  ChangeDetectorRef,
  Component,
  computed,
  Input,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { Panel } from 'primeng/panel';
import { SparesStatisticalData } from '../../models/spares-statistical-data';
import {
  ChartDataItem,
  ChartItem,
} from '../../../admin-panel-analytics-menu/types/chart-item.interface';
import {
  ChartStyleInformation,
  ChartStyleInformationFactory,
} from '../../../admin-panel-parsers-menu/components/parser-charts/services/chart-style.information';
import { UIChart } from 'primeng/chart';

@Component({
  selector: 'app-spare-parser-charts',
  imports: [Panel, UIChart],
  templateUrl: './spare-parser-charts.component.html',
  styleUrl: './spare-parser-charts.component.scss',
})
export class SpareParserChartsComponent {
  @Input({ required: true, alias: 'data' }) set _statisticalData(
    data: SparesStatisticalData[],
  ) {
    this.statisticalInfoSignal.set(data);
    const colors = data.map(() =>
      ChartStyleInformationFactory.getRandomColor(),
    );
    this.colorsSignal.set(colors);
  }

  readonly chartItemsSignal: Signal<ChartItem[]> = computed((): ChartItem[] => {
    return this.statisticalInfoSignal().map(
      (info: SparesStatisticalData): ChartItem => {
        return { label: info.spareType, numeric: info.count };
      },
    );
  });

  readonly chartDataSignal: Signal<ChartDataItem> = computed(
    (): ChartDataItem => {
      const data: ChartItem[] = this.chartItemsSignal();
      const labels: string[] = data.map((i) => i.label);
      const numerics: number[] = data.map((i) => i.numeric);
      return { labels: labels, numerics: numerics };
    },
  );

  readonly chartDataViewModel = computed(() => {
    const data = this.chartDataSignal();
    return {
      labels: data.labels,
      datasets: [
        {
          label: 'Типы запчастей и количество',
          data: data.numerics,
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
      indexAxis: 'x',
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: chartStyleInformation.primaryTextColor,
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
        },
        zoom: {
          enabled: true,
          mode: 'xy',
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

  readonly chartStyleInformationSignal: Signal<ChartStyleInformation> =
    computed((): ChartStyleInformation => {
      return ChartStyleInformationFactory.createChartStyleInformation();
    });

  readonly statisticalInfoSignal: WritableSignal<SparesStatisticalData[]>;
  readonly colorsSignal: WritableSignal<string[]>;
  private readonly _cd: ChangeDetectorRef;

  constructor(cd: ChangeDetectorRef) {
    this.statisticalInfoSignal = signal([]);
    this.colorsSignal = signal([]);
    this._cd = cd;
  }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, EventEmitter, Input, Output, signal, Signal, WritableSignal } from '@angular/core';
import { ChartStyleInformation, ChartStyleInformationFactory } from '../../admin-page/admin-panel-menu/admin-panel-parsers-menu/components/parser-charts/services/chart-style.information';
import { UIChart } from 'primeng/chart';
import { SparePriceViewModel } from '../types/spare-paged-viewmodel';

@Component({
  selector: 'app-spare-price-chart',
  imports: [UIChart],
  templateUrl: './spare-price-chart.component.html',
  styleUrl: './spare-price-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SparePriceChartComponent {
  @Output() priceSelected: EventEmitter<number>;

  @Input({ required: true, alias: 'prices' }) set _prices(
    value: SparePriceViewModel[],
  ) {
    this.pricesSignal.set(value);
  }

  readonly pricesSignal: WritableSignal<SparePriceViewModel[]>;

  readonly pricesChartDataSignal = computed(() => {
    const prices = this.pricesSignal();
    const values = prices.map((pr) => pr.price);
    const labels = values.map((v) => {
      return v.toString();
    });
    return {
      labels: labels,
      datasets: [
        {
          label: 'Цены',
          data: values,
          borderWidth: 1,
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
      indexAxis: 'x',
      maintainAspectRatio: false,
      aspectRatio: 1,
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
    // const selectedIndex: number = dataItem.element.index;
    // const prices = this.pricesSignal().prices.map((pr) => );
    // const selectedPrice = prices[selectedIndex];
    // this.priceSelected.emit(selectedPrice);
  }

  constructor(cd: ChangeDetectorRef) {
    this.pricesSignal = signal([])
    this.priceSelected = new EventEmitter<number>();
    this._cd = cd;
  }
}

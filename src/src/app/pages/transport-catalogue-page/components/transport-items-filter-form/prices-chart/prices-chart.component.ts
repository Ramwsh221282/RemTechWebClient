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
import { AdvertisementPricesResponse } from '../../../types/advertisement-prices-response';
import {
  ChartStyleInformation,
  ChartStyleInformationFactory,
} from '../../../../admin-page/admin-panel-menu/admin-panel-parsers-menu/components/parser-charts/services/chart-style.information';
import { Button } from 'primeng/button';
import { UIChart } from 'primeng/chart';

@Component({
  selector: 'app-prices-chart',
  imports: [UIChart],
  templateUrl: './prices-chart.component.html',
  styleUrl: './prices-chart.component.scss',
})
export class PricesChartComponent {
  @Output() priceSelected: EventEmitter<number>;

  @Input({ required: true, alias: 'prices' }) set _prices(
    value: AdvertisementPricesResponse,
  ) {
    this.pricesSignal.set(value);
  }

  readonly pricesSignal: WritableSignal<AdvertisementPricesResponse>;

  readonly pricesChartDataSignal = computed(() => {
    const prices = this.pricesSignal();
    const values = prices.prices;
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
    const selectedIndex: number = dataItem.element.index;
    const prices = this.pricesSignal().prices;
    const selectedPrice = prices[selectedIndex];
    this.priceSelected.emit(selectedPrice);
  }

  constructor(cd: ChangeDetectorRef) {
    this.pricesSignal = signal({ prices: [] });
    this.priceSelected = new EventEmitter<number>();
    this._cd = cd;
  }
}

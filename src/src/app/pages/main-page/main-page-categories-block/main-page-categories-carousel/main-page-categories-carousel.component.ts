import { Component } from '@angular/core';
import { Carousel } from 'primeng/carousel';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';

interface TransportCategories {
  name: string;
  count: number;
}

@Component({
  selector: 'app-main-page-categories-carousel',
  imports: [Carousel, Card, Button],
  templateUrl: './main-page-categories-carousel.component.html',
  styleUrl: './main-page-categories-carousel.component.scss',
})
export class MainPageCategoriesCarouselComponent {
  public categories: TransportCategories[] = [
    { name: 'Фронтальный погрузчик', count: 42 },
    { name: 'Форвардер', count: 38 },
    { name: 'Экскаватор', count: 27 },
    { name: 'Мини погрузчик', count: 19 },
    { name: 'Вилочный погрузчик', count: 22 },
  ];
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclesCataloguePageComponent } from './vehicles-catalogue-page.component';

describe('VehiclesCataloguePageComponent', () => {
  let component: VehiclesCataloguePageComponent;
  let fixture: ComponentFixture<VehiclesCataloguePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiclesCataloguePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclesCataloguePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import {Component} from '@angular/core';
import {AdminParsersPanelComponent} from './admin-parsers-panel/admin-parsers-panel.component';

@Component({
  selector: 'app-admin-page',
  imports: [
    AdminParsersPanelComponent
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss'
})
export class AdminPageComponent {

}

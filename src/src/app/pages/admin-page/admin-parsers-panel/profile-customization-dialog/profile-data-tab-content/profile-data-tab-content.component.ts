import {Component, EventEmitter, Input, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {Select, SelectChangeEvent} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {ParserProfile, ParserProfileFactory} from '../../../types/parser-profile';

@Component({
  selector: 'app-profile-data-tab-content',
  imports: [
    FormsModule,
    InputText,
    Select
  ],
  templateUrl: './profile-data-tab-content.component.html',
  styleUrl: './profile-data-tab-content.component.scss'
})
export class ProfileDataTabContentComponent implements OnInit {
  @Input({required: true}) profileCopy: ParserProfile = ParserProfileFactory.empty();
  @Output() profileChanged: EventEmitter<ParserProfile> = new EventEmitter();
  public repeatHourOptions: string[] = ['1','2','3','4','5','6','7','8','9','10','11','12'];
  public stateOptions: string[] = ['Отключен', 'Парсит'];
  public profileName: string = '';

  public ngOnInit(): void {
    this.profileName = this.profileCopy.name;
  }

  public get displayProfileHour(): string {
    return String(this.profileCopy.repeatEveryHours)
  }

  public get displayProfileState(): string {
    return this.profileCopy.state;
  }

  public profileNameChanged(event: string): void {
    const updated: ParserProfile = ParserProfileFactory.updated(this.profileCopy, { name: event });
    this.profileChanged.emit(updated);
  }

  public stateChanged(event: SelectChangeEvent): void {
    const state = event.value as string;
    const updated: ParserProfile = ParserProfileFactory.updated(this.profileCopy, { state: state });
    this.profileChanged.emit(updated);
  }

  public hoursChanged(event: SelectChangeEvent): void {
    const hours: number = Number(event.value as string);
    const updated: ParserProfile = ParserProfileFactory.updated(this.profileCopy, { repeatEveryHours: hours });
    this.profileChanged.emit(updated);
  }
}

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {ParserProfile, ParserProfileFactory} from '../../../types/parser-profile';
import {StringUtils} from '../../../../../shared/utils/string-utils';
import {ArrayUtils} from '../../../../../shared/utils/array-utils';

@Component({
  selector: 'app-profile-links-tab-content',
  imports: [
    Button,
    InputText,
    ReactiveFormsModule,
    TableModule,
    FormsModule
  ],
  templateUrl: './profile-links-tab-content.component.html',
  styleUrl: './profile-links-tab-content.component.scss'
})
export class ProfileLinksTabContentComponent {
  @Input({required: true}) profile: ParserProfile = ParserProfileFactory.empty();
  @Output() profileChanged: EventEmitter<ParserProfile> = new EventEmitter();
  public linkInputValue: string = '';

  public addLink(): void {
    if (StringUtils.isEmptyOrWhiteSpace(this.linkInputValue)) return;
    this.handleAddLink();
    this.refreshInputValue();
  }

  public removeLink(link: string): void {
    const updatedLinks: string[] = ArrayUtils.removeItem(this.profile.links, item => item === link);
    const updated: ParserProfile = ParserProfileFactory.updated(this.profile, { links: updatedLinks });
    this.profileChanged.emit(updated);
  }

  public submitByEnterKey(event: KeyboardEvent): void {
    event.stopPropagation();
    if (StringUtils.isEmptyOrWhiteSpace(this.linkInputValue)) return;
    if (event.key === 'Enter') {
      this.handleAddLink();
      this.refreshInputValue();
    }
  }

  private handleAddLink(): void {
    const updatedLinks: string[] = ArrayUtils.addItem(this.linkInputValue, this.profile.links);
    const updated: ParserProfile = ParserProfileFactory.updated(this.profile, { links: updatedLinks });
    this.profileChanged.emit(updated);
  }

  private refreshInputValue(): void {
    this.linkInputValue = '';
  }
}

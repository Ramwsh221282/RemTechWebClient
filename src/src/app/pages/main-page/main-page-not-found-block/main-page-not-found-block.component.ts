import { Component } from '@angular/core';
import { Panel } from 'primeng/panel';
import { NgOptimizedImage } from '@angular/common';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { PasswordDirective } from 'primeng/password';

@Component({
  selector: 'app-main-page-not-found-block',
  imports: [Panel, NgOptimizedImage, InputText, Button, PasswordDirective],
  templateUrl: './main-page-not-found-block.component.html',
  styleUrl: './main-page-not-found-block.component.scss',
})
export class MainPageNotFoundBlockComponent {}

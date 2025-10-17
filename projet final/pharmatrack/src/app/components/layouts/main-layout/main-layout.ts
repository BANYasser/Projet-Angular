import { HeaderComponent } from './../header/header';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, Footer],
  template: `
    <app-header />
    <main class="main-content"><router-outlet /></main>
    <app-footer />
  `,
  styleUrls: ['./main-layout.scss']
})
export class MainLayoutComponent {}


import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { HomeMapComponent } from './components/map/map.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './pages/home/home-page.component';

@NgModule({
  declarations: [HomePageComponent, HomeMapComponent],
  imports: [
    CommonModule,
    FormsModule,
    HomeRoutingModule,
    ButtonModule,
    CardModule,
    DialogModule,
    InputTextModule,
    ProgressBarModule,
    TagModule
  ]
})
export class HomeModule {}

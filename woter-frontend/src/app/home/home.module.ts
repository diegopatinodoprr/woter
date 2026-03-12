import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomeMapComponent } from './components/map/map.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './pages/home/home-page.component';

@NgModule({
  declarations: [HomePageComponent, HomeMapComponent],
  imports: [CommonModule, FormsModule, HomeRoutingModule]
})
export class HomeModule {}

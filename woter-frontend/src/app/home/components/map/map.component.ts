import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-home-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
  standalone: false
})
export class HomeMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true })
  private readonly mapContainerRef!: ElementRef<HTMLDivElement>;

  private mapInstance: L.Map | null = null;

  ngAfterViewInit(): void {
    this.mapInstance = L.map(this.mapContainerRef.nativeElement, {
      center: [48.8566, 2.3522],
      zoom: 11,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.mapInstance);

    L.marker([48.8566, 2.3522]).addTo(this.mapInstance).bindPopup('Woter - Paris');

    setTimeout(() => this.mapInstance?.invalidateSize(), 0);
  }

  ngOnDestroy(): void {
    this.mapInstance?.remove();
    this.mapInstance = null;
  }
}

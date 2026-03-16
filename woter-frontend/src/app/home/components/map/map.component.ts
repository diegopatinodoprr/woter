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
  private userMarker: L.Marker | null = null;
  private userAccuracyCircle: L.Circle | null = null;
  private searchMarker: L.Marker | null = null;

  protected isRequestingLocation = false;
  protected canRequestLocation = true;
  protected locationMessage = 'Autorisez la geolocalisation pour centrer la carte sur votre position.';

  ngAfterViewInit(): void {
    this.mapInstance = L.map(this.mapContainerRef.nativeElement, {
      center: [48.8566, 2.3522],
      zoom: 13,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(this.mapInstance);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.mapInstance);

    L.marker([48.8566, 2.3522]).addTo(this.mapInstance).bindPopup('Woter - Paris');

    this.initLocationModule();
    setTimeout(() => this.mapInstance?.invalidateSize(), 0);
  }

  ngOnDestroy(): void {
    this.mapInstance?.remove();
    this.mapInstance = null;
    this.userMarker = null;
    this.userAccuracyCircle = null;
    this.searchMarker = null;
  }

  public requestUserLocation(): void {
    if (!navigator.geolocation || !this.mapInstance) {
      this.canRequestLocation = false;
      this.locationMessage = 'La geolocalisation n est pas disponible sur cet appareil.';
      return;
    }

    this.isRequestingLocation = true;
    this.locationMessage = 'Demande d autorisation de geolocalisation...';

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.isRequestingLocation = false;
        this.canRequestLocation = true;

        this.centerMapOnPosition(position.coords.latitude, position.coords.longitude, position.coords.accuracy);
      },
      (error) => {
        this.isRequestingLocation = false;
        this.handleLocationError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0
      }
    );
  }

  public centerOnCoordinates(latitude: number, longitude: number, label?: string): void {
    if (!this.mapInstance) {
      return;
    }

    const searchLatLng = L.latLng(latitude, longitude);
    this.mapInstance.setView(searchLatLng, 16, { animate: true });

    if (!this.searchMarker) {
      this.searchMarker = L.marker(searchLatLng).addTo(this.mapInstance);
    } else {
      this.searchMarker.setLatLng(searchLatLng);
    }

    const popupLabel = label ? `Resultat: ${label}` : 'Resultat de recherche';
    this.searchMarker.bindPopup(popupLabel).openPopup();
    this.locationMessage = 'Recherche terminee. Carte centree sur le resultat.';
  }

  private initLocationModule(): void {
    if (!navigator.geolocation) {
      this.canRequestLocation = false;
      this.locationMessage = 'La geolocalisation n est pas supportee par ce navigateur.';
      return;
    }

    if (!navigator.permissions?.query) {
      return;
    }

    navigator.permissions
      .query({ name: 'geolocation' })
      .then((permissionStatus) => {
        if (permissionStatus.state === 'granted') {
          this.requestUserLocation();
        } else if (permissionStatus.state === 'denied') {
          this.canRequestLocation = false;
          this.locationMessage = 'Geolocalisation refusee. Activez-la dans les reglages du navigateur.';
        }
      })
      .catch(() => {
        // Ignore permissions API failures and keep manual geolocation request available.
      });
  }

  private centerMapOnPosition(latitude: number, longitude: number, accuracy: number): void {
    if (!this.mapInstance) {
      return;
    }

    const userLatLng = L.latLng(latitude, longitude);
    this.mapInstance.setView(userLatLng, 17, { animate: true });

    if (!this.userMarker) {
      this.userMarker = L.marker(userLatLng).addTo(this.mapInstance).bindPopup('Vous etes ici');
    } else {
      this.userMarker.setLatLng(userLatLng);
    }

    if (!this.userAccuracyCircle) {
      this.userAccuracyCircle = L.circle(userLatLng, {
        radius: accuracy,
        color: '#134074',
        fillColor: '#8da9c4',
        fillOpacity: 0.2,
        weight: 1
      }).addTo(this.mapInstance);
    } else {
      this.userAccuracyCircle.setLatLng(userLatLng);
      this.userAccuracyCircle.setRadius(accuracy);
    }
  }

  private handleLocationError(error: GeolocationPositionError): void {
    this.canRequestLocation = true;

    switch (error.code) {
      case error.PERMISSION_DENIED:
        this.locationMessage = 'Geolocalisation refusee. Autorisez-la pour centrer la carte.';
        break;
      case error.POSITION_UNAVAILABLE:
        this.locationMessage = 'Position indisponible. Verifiez votre signal GPS et reessayez.';
        break;
      case error.TIMEOUT:
        this.locationMessage = 'Delai depasse. Reessayez pour obtenir votre position.';
        break;
      default:
        this.locationMessage = 'Impossible de recuperer votre position pour le moment.';
        break;
    }
  }
}

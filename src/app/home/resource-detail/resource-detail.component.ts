import { Component } from '@angular/core';
import { ResourceService } from '../../common/service/resource.service';
import 'leaflet-routing-machine';
declare let L:any;


@Component({
  selector: 'app-resource-detail',
  templateUrl: './resource-detail.component.html',
  styleUrl: './resource-detail.component.scss'
})
export class ResourceDetailComponent {
  map:any;
  icon = {
    icon: L.icon({
      iconSize: [ 25, 41 ],
      iconAnchor: [ 13, 0 ],
      iconUrl: 'assets/markers/leaf-green.png',
      shadowUrl: 'assets/markers/leaf-shadow.png'
    })
  };
  latitude: any = null;
  longitude: any = null;
  resourceDetails:any;

  constructor(private resourceService:ResourceService,){

  }

  ngOnInit(){
    this.latitude = JSON.parse(String(localStorage.getItem('ClientLat')));
    this.longitude = JSON.parse(String(localStorage.getItem('ClientLon')));
    this.map = L.map('map').setView([this.latitude, this.longitude], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Leaflet'
    }).addTo(this.map);

    this.resourceService.getResourceData.subscribe((resourceData:any)=>{
      this.resourceDetails = resourceData;
    });

    this.getRoute(this.resourceDetails);

  }

  getRoute(data:any){
    L.Routing.control({
      waypoints: [
        L.latLng(this.latitude, this.longitude),
        L.latLng(data.latitude, data.longitude)
      ],
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: 'green', opacity: 1, weight: 5 }]
      },
      createMarker: function (i: number, waypoint: any, n: number) {
        const marker = L.marker(waypoint.latLng, {
          draggable: false,
          bounceOnAdd: false,
          // bounceOnAddOptions: {
          //   duration: 1000,
          //   height: 800,
          //   function() {
          //     (bindPopup(myPopup).openOn(map))
          //   }
          // },
          icon: L.icon({
            iconUrl: 'assets/markers/default-marker.png',
            iconSize: [55, 95],
            iconAnchor: [54, 94],
            popupAnchor: [-3, -76],
            shadowUrl: 'assets/markers/leaf-shadow.png',
            shadowSize: [68, 95],
            shadowAnchor: [22, 94]
          })
        });
        return marker;
      }
    }).addTo(this.map);
    this.map.fitBounds([[this.latitude,this.longitude],[data.latitude,data.longitude]]);
  }
}

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MapOptions, latLng, tileLayer, Marker, marker, icon } from 'leaflet'; // If using ngx-leaflet
declare let L:any;

import {
  ColumnMode,
  DatatableComponent,
  TableColumn
} from '@swimlane/ngx-datatable';
import { ResourceService } from '../../common/service/resource.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrl: './add-resource.component.scss'
})
export class AddResourceComponent {
  latitude: any = null;
  longitude: any = null;
  errorMessage: string | null = null;
  resourceCategory:string = 'Choose Resource Category';
  resourceName:string = 'Choose Resource Name';
  resourceAge:string = '';
  resourceFeedback:string = '';
  resourceCategoryList:any = [];
  resourceNameList:any = [];
  filteredResourceNameList:any = [];
  resourceList:any = [];
  map:any;

  resourceType = [
    { value: 'New Resource', label: 'New Resource' },
    { value: 'Existing Resource', label: 'Existing Resource' }
  ];
  
  selectedResourceType = 'Existing Resource';

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 16,
    center: latLng(28.631589, 77.118395)
  };

  icon = {
    icon: L.icon({
      iconSize: [ 25, 41 ],
      iconAnchor: [ 13, 0 ],
      iconUrl: 'assets/markers/leaf-green.png',
      shadowUrl: 'assets/markers/leaf-shadow.png'
    })
  };

  markers:Marker[] = [];

  constructor(
    private http:HttpClient,
    private resourceService:ResourceService,
    private router: Router
  ){

  }

  async ngOnInit() {
    await this.getCurrentLocation();
    // this.options = {
    //   layers: [
    //     tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    //   ],
    //   zoom: 16,
    //   center: latLng(this.latitude,this.longitude)
    // };
    await this.getResourceCategory();
    // await this.getResourceName();
    await this.getResourceList();

    // const map = L.map('map').setView([this.latitude, this.longitude], 16);

    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    // }).addTo(map);
  }

  async getCurrentLocation(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.errorMessage = null; // Clear any previous error
          localStorage.setItem('ClientLat',JSON.stringify(this.latitude));
          localStorage.setItem('ClientLon',JSON.stringify(this.longitude));
          this.map = L.map('map').setView([this.latitude, this.longitude], 16);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: 'Leaflet'
          }).addTo(this.map);
        },
        (error: GeolocationPositionError) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.errorMessage = 'User denied the request for Geolocation.';
              break;
            case error.POSITION_UNAVAILABLE:
              this.errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              this.errorMessage = 'The request to get user location timed out.';
              break;
            default:
              this.errorMessage = 'An unknown error occurred.';
              break;
          }
          this.latitude = null;
          this.longitude = null;
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      this.errorMessage = 'Geolocation is not supported by this browser.';
    }
  }

  async getResourceCategory(){
    this.http.get('http://localhost:5555/resourceCategory').subscribe((response:any)=>{
      console.log('Response GET -->',response);
      this.resourceCategoryList = response.data;
      this.resourceCategory = response.data[0].resource_category;
      this.getResourceName();
    })
  }

  getResourceName(){
    this.http.get('http://localhost:5555/resourceName').subscribe((response:any)=>{
      console.log('Response GET -->',response);
      this.resourceNameList = response.data;
      // this.resourceName = response.data[0].resource_name;
      this.filterResourceName(this.resourceCategory);
    })
  }

  filterResourceName(resourceCategory:string){
    console.log('filterResourceName-->',this.filteredResourceNameList,resourceCategory);
    this.filteredResourceNameList = this.resourceNameList.filter((item:any)=>item.resource_category == resourceCategory);
    this.resourceName = this.filteredResourceNameList[0].resource_name;
    console.log('filterResourceName-->',this.filteredResourceNameList,resourceCategory);
  }

  onSelectionChange(eventData:any){
    console.log('Dropdown selection-->',eventData);
    this.filteredResourceNameList = this.resourceNameList.filter((item:any)=>item.resource_category == eventData.target.value);
    this.resourceName = this.filteredResourceNameList[0].resource_name;
  }

  addResource(){
    let requestBody = {
      'resource_type': this.selectedResourceType,
      'latitude': this.latitude,
      'longitude': this.longitude,
      'resource_category': this.resourceCategory,
      'resource_name': this.resourceName,
      'resource_age': this.resourceAge,
      'resource_feedback': this.resourceFeedback
    }
    this.http.post('http://localhost:5555/addResource',requestBody).subscribe((response:any)=>{
      console.log('Response POST -->',response);
    });
  }

  getResourceList(){
    this.http.get('http://localhost:5555/addResource').subscribe((response:any)=>{
      console.log('Response GET -->',response);
      this.resourceList = response.data;
      this.addMarkers();
      // this.resourceNameList = response.data;
      // this.resourceName = response.data[0].resource_name;
      // this.filterResourceName(this.resourceCategory);
    })
  }

  addMarkers(){
    let mapBounds:any = [];
    for(let i=0;i<this.resourceList.length;i++){
      // let temp:any = marker([this.resourceList[0].latitude, this.resourceList[0].longitude], {
      //   icon: icon({
      //     iconSize: [25, 41],
      //     iconAnchor: [13, 41],
      //     iconUrl: 'assets/markers/leaf-green.png', // Path to your marker icon
      //     shadowUrl: 'assets/markers/leaf-shadow.png' // Path to your marker shadow
      //   })
      // }).bindPopup('<b>Hello world!</b><br />I am a popup.');
      // this.markers.push(temp);
      let tempBound = [];
      tempBound.push(this.resourceList[i].latitude,this.resourceList[i].longitude);
      mapBounds.push(tempBound);
      const marker = L.marker([this.resourceList[i].latitude, this.resourceList[i].longitude], this.icon).addTo(this.map);
      marker.bindPopup(`<b>Resource Category:</b> ${this.resourceList[i].resource_category} <br /><b>Resource Name:</b> ${this.resourceList[i].resource_name} <br />`);
    }
    console.log('Markers-->',this.markers);
    this.map.fitBounds(mapBounds);
  }

  getResourceLocation(resource:any){
    this.resourceService.getResourceData.next(resource);
    this.router.navigateByUrl('resouce-detail');
  }

}



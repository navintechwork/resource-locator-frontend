import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  countResourceCategory:any;
  countResourceName:any;
  countResource:any;

  constructor(
    private router: Router,
    private http:HttpClient,
  ){

  }

  ngOnInit(){
    this.getResourceCategory();
    this.getResourceName();
    this.getResourceList();
  }

  addResouce(){
    this.router.navigateByUrl('add-resouce');
  }

  addResouceType(){
    this.router.navigateByUrl('add-resouce-type');
  }

  getResourceCategory(){
    this.http.get('http://localhost:5555/resourceCategory').subscribe((response:any)=>{
      console.log('Response GET -->',response);
      this.countResourceCategory = response.count;
      this.getResourceName();
    })
  }

  getResourceName(){
    this.http.get('http://localhost:5555/resourceName').subscribe((response:any)=>{
      console.log('Response GET -->',response);
      this.countResourceName = response.count;
    })
  }

  getResourceList(){
    this.http.get('http://localhost:5555/addResource').subscribe((response:any)=>{
      console.log('Response GET -->',response);
      this.countResource = response.count;
    })
  }

}

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-add-resource-type',
  templateUrl: './add-resource-type.component.html',
  styleUrl: './add-resource-type.component.scss'
})
export class AddResourceTypeComponent {
  requestCategory:string = '';
  requestName:string = '';
  resourceCategoryList:any = [];
  resourceNameList:any = [];
  filteredResourceNameList:any = [];
  selectedResourceCategory = '';
  constructor(private http:HttpClient){

  }

  async ngOnInit(){
    await this.getResourceCategory();
    await this.getResourceName();
  }

  addResourceCategory(){
    let requestBody = {
      'resource_category': this.requestCategory
    }
    this.http.post('http://localhost:5555/resourceCategory',requestBody).subscribe((response:any)=>{
      console.log('Response POST -->',response);
    });

  }

  getResourceCategory(){
    this.http.get('http://localhost:5555/resourceCategory').subscribe((response:any)=>{
      console.log('Response GET -->',response);
      this.resourceCategoryList = response.data;
      this.selectedResourceCategory = response.data[0].resource_category;
      console.log('selectedResourceCategory-->',this.selectedResourceCategory);
      // this.filterResourceName(this.selectedResourceCategory);
    })
  }

  addResourceName(){
    let requestBody = {
      'resource_category': this.selectedResourceCategory,
      'resource_name': this.requestName
    }
    this.http.post('http://localhost:5555/resourceName',requestBody).subscribe((response:any)=>{
      console.log('Response POST -->',response);
    });

  }

  getResourceName(){
    this.http.get('http://localhost:5555/resourceName').subscribe((response:any)=>{
      console.log('Response GET -->',response);
      this.resourceNameList = response.data;
      this.filterResourceName(this.selectedResourceCategory);
    })
  }

  filterResourceName(resourceCategory:string){
    this.filteredResourceNameList = this.resourceNameList.filter((item:any)=>item.resource_category == resourceCategory);
    console.log('filterResourceName-->',this.filteredResourceNameList,resourceCategory);
  }

  onSelectionChange(eventData:any){
    console.log('Dropdown selection-->',eventData);
    this.filteredResourceNameList = this.resourceNameList.filter((item:any)=>item.resource_category == eventData.target.value);
  }

}

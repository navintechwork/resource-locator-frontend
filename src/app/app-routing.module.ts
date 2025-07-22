import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './home/landing-page/landing-page.component';
import { AddResourceComponent } from './home/add-resource/add-resource.component';
import { AddResourceTypeComponent } from './home/add-resource-type/add-resource-type.component';
import { ResourceDetailComponent } from './home/resource-detail/resource-detail.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'add-resouce', component: AddResourceComponent },
  { path: 'add-resouce-type', component: AddResourceTypeComponent },
  { path: 'resouce-detail', component: ResourceDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

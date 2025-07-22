import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeafletDirective, LeafletModule } from '@bluehalo/ngx-leaflet';
import { LandingPageComponent } from './home/landing-page/landing-page.component';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { AddResourceComponent } from './home/add-resource/add-resource.component';
import { FormsModule } from '@angular/forms';
import { AddResourceTypeComponent } from './home/add-resource-type/add-resource-type.component';
import { HttpClientModule } from '@angular/common/http';
import { ResourceDetailComponent } from './home/resource-detail/resource-detail.component';
import { ResourceService } from './common/service/resource.service';
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    HeaderComponent,
    FooterComponent,
    AddResourceComponent,
    AddResourceTypeComponent,
    ResourceDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule,
    LeafletDirective,
    FormsModule,
    HttpClientModule,
  ],
  providers: [ResourceService],
  bootstrap: [AppComponent]
})
export class AppModule { }

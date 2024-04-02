import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StatDetailComponent } from './stat-detail/stat-detail.component';
import { RecordDetailComponent } from './stat-detail/record-detail/record-detail.component';

@NgModule({
  declarations: [AppComponent, StatDetailComponent, RecordDetailComponent],
  imports: [BrowserModule, CanvasJSAngularChartsModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

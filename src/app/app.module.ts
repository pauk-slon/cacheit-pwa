import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import {
  MatButtonModule,
  MatDialogModule,
  MatSidenavModule,
  MatIconModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
} from '@angular/material';

import { AppComponent } from './app.component';
import { ItemService } from './item.service';
import { SafeUrlPipe } from './safe-url.pipe';
import { ItemTableComponent } from './item-table/item-table.component';
import { ItemViewComponent } from './item-view/item-view.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ByteSizePipe } from './byte-size.pipe';


@NgModule({
  declarations: [
    AppComponent,
    SafeUrlPipe,
    ItemTableComponent,
    ItemViewComponent,
    ByteSizePipe,
  ],
  entryComponents: [
    ItemViewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatToolbarModule,
    LayoutModule,
    MatSidenavModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    ItemService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

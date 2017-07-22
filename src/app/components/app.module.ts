import {OnsenModule} from 'ngx-onsenui';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import { AppSplitter } from './app.splitter';
import { MenuComponent } from './app.menu';
import { AlertsComponent } from './app.alerts';
import { LogComponent } from './app.log';
import { DatabaseComponent } from './app.database';
import { DBEntryComponent } from './app.dbentry';

import { Logger } from '../services/logger.service';
import { V1Service } from '../services/v1.service';
import { LocationService } from '../services/location.service';
import { DBService } from '../services/db.service';

import '../../../node_modules/onsenui/css/onsenui.css';
import '../../../node_modules/onsenui/css/onsen-css-components.css';

@NgModule({
  imports: [
    OnsenModule
  ],
  declarations: [
    AppSplitter,
    MenuComponent,
    AlertsComponent,
    DatabaseComponent,
    LogComponent,
    DBEntryComponent
  ],
  entryComponents: [
    MenuComponent,
    AlertsComponent,
    DatabaseComponent,
    LogComponent,
    DBEntryComponent
  ],
  providers: [
  	Logger,
  	V1Service,
  	LocationService,
  	DBService
  ],
  bootstrap: [ AppSplitter ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

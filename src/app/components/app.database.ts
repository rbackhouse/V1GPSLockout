import {
  Component,
  OnsSplitterContent,
  OnsenModule,
  NgModule,
  onsNotification,
  CUSTOM_ELEMENTS_SCHEMA
} from 'ngx-onsenui';

import { ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';

import { Header } from './app.header';
import { Logger } from '../services/logger.service';
import { V1Service } from '../services/v1.service';
import { DBService } from '../services/db.service';
import { DBEntryComponent } from './app.dbentry';

@Component({
  	selector: 'ons-page',
  	templateUrl: './app.database.html'
})
@Header()
export class DatabaseComponent implements OnInit, OnDestroy {
  	title:string = 'Database';
  	connected = false;
  	dbEntries:any = [];

	constructor(
		private splitter: OnsSplitterContent,
		private v1Service: V1Service,
		private DB: DBService,
		private cd: ChangeDetectorRef) {
	}
	
	ngOnInit() {
		this.DB.getAlerts().subscribe(
			(rows:any) => {
				rows.forEach((row:any) => {
					if (row.alert.frequency) {
						let entry = {
							frequency: row.alert.frequency,
							band: row.alert.band,
							locationCount: row.locations.length
						};
						this.dbEntries.push(entry);
					}
				});
			}
		);
		this.v1Service.onStateChange().subscribe(
			(state: any) => {
				this.connected = state.connected;
				this.cd.detectChanges();
			}
		);	
	}

	ngOnDestroy() { 
	}
	
	connect() {}
	
	copy() {
		onsNotification.prompt({message: 'Enter DB URL'}).then((url:any) => {
			console.log("URL:"+url);
			this.DB.replicate(url).subscribe(
				(result:any) => {
					onsNotification.alert('DB Copy succeeded');
				},
				(err:any) => {	
					onsNotification.alert('DB Copy failed : '+err.message);
				}
			);
		});
	}
	
	clearDB() {
		this.DB.clear();
	}
	
	clicked(frequency:any) {
		this.splitter.element.parentElement.content.load(DBEntryComponent).then(
			(page:any) => {
				page.data = {frequency: frequency};
			}
		);
	}
}
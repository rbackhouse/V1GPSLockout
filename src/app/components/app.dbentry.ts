import {
  Component,
  OnsSplitterContent,
  OnsenModule,
  NgModule,
  ElementRef,
  CUSTOM_ELEMENTS_SCHEMA
} from 'ngx-onsenui';

import { ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';

import { Header } from './app.header';
import { Logger } from '../services/logger.service';
import { V1Service } from '../services/v1.service';
import { DBService } from '../services/db.service';

@Component({
  	selector: 'ons-page',
  	templateUrl: './app.dbentry.html',
  	styleUrls: ['./app.dbentry.css']
})
@Header()
export class DBEntryComponent implements OnInit, OnDestroy {
  	connected = false;
	alertDoc: any = {
		alert: {
			frequency: "",
			band: ""
		},
		locations: []
	};
	
	constructor(
		private splitter: OnsSplitterContent,
		private v1Service: V1Service,
		private DB: DBService,
		private cd: ChangeDetectorRef,
		private ref: ElementRef) {
	}
	
	ngOnInit() {
		this.DB.getAlert(this.ref.nativeElement.data.frequency, (err:any, alertDoc:any) => {
			if (!err) {
				this.alertDoc.alert = alertDoc.alert;
				alertDoc.locations.forEach(
					(location:any) => {
						this.alertDoc.locations.push({
							lat: location.lat,
							lng: location.lng,
							direction: location.direction,
							timestamp: Logger.dtFormat(new Date(location.timestamp)),
							frontSignalStrength: parseInt(parseInt(location.frontSignalStrength,16).toString(10)),
							rearSignalStrength: parseInt(parseInt(location.rearSignalStrength,16).toString(10))
						});
					}
				);	
			}
		});
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
	
	flag() {
	}
}
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

const geolib = require('geolib');

@Component({
  	selector: 'ons-page',
  	templateUrl: './app.dbentry.html'
})
@Header()
export class DBEntryComponent implements OnInit, OnDestroy {
  	connected = false;
	alertEntry: any = {
		alert: {
			frequency: "",
			band: ""
		},
		locations: []
	};
	
	constructor(
		private splitter: OnsSplitterContent,
		private v1Service: V1Service,
		private cd: ChangeDetectorRef,
		private ref: ElementRef) {
	}
	
	ngOnInit() {
		this.alertEntry = this.ref.nativeElement.data;
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
	
	map() {
	}	
}
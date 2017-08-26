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
import { MapService } from '../services/map.service';
import { DBEntryComponent } from './app.dbentry';

@Component({
  	selector: 'ons-page',
  	templateUrl: './app.map.html'
})
export class MapComponent implements OnInit, OnDestroy {
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
		private mapService: MapService,
		private cd: ChangeDetectorRef,
		private ref: ElementRef) {
	}
	
	ngOnInit() {
		this.alertDoc = this.ref.nativeElement.data;
		let pins:any = [];
		this.alertDoc.locations.forEach((location:any) => {
			pins.push({
                lat: location.lat,
                lon: location.lng,
                title: location.direction+" ["+location.frontSignalStrength+"] ["+location.rearSignalStrength+"]",
                snippet: location.timestamp,
                icon: this.mapService.iconColors.HUE_ROSE
			});
			
			this.mapService.showMap(
				pins, 
				{
					//height: 360,
					//width: 250,
					//diameter: 1000,
					atBottom: false,
					lat: this.alertDoc.locations[0].lat,
					lon: this.alertDoc.locations[0].lng
				}
			);	
		});
	
		this.v1Service.onStateChange().subscribe(
			(state: any) => {
				this.connected = state.connected;
				this.cd.detectChanges();
			}
		);	
	}

	ngOnDestroy() {
		this.mapService.hideMap();
	}
	
	connect() {}
	
	back() {
		this.splitter.element.parentElement.content.load(DBEntryComponent).then(
			(page:any) => {
				page.data = {frequency: this.alertDoc.alert.frequency};
			}
		);
	}
}
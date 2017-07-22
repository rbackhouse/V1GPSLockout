import {
  Component,
  OnsSplitterContent,
  OnsenModule,
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA
} from 'ngx-onsenui';

import { ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';

import { Header } from './app.header';
import { Logger } from '../services/logger.service';
import { V1Service } from '../services/v1.service';
import {Observable} from 'rxjs/Observable';

@Component({
  	selector: 'ons-page',
  	templateUrl: './app.alerts.html',
  	styleUrls: ['./app.alerts.css']
})
@Header()
export class AlertsComponent implements OnInit, OnDestroy {
  	title:string = 'V1 Alerts';
  	connected = false;
  	alerts:any = [];
  	private alertMap = {};
  	private subscription:any;

	constructor(private splitter: OnsSplitterContent, 
				private v1Service: V1Service, 
				private logger: Logger,
				private cd: ChangeDetectorRef) {
	}
	
	ngOnInit() {
		this.alertMap = this.v1Service.getAlertMap();
		this.updateAlerts();
		this.v1Service.onAlert().subscribe(
			(a: any) => {
				if (a.alert) {
					this.alertMap[a.alert.frequency] = a;
					this.updateAlerts();
					this.cd.detectChanges();		
				}	
			}
		);
		this.v1Service.onStateChange().subscribe(
			(state: any) => {
				this.connected = state.connected;
				this.cd.detectChanges();
			}
		);	
		this.v1Service.onDisplay().subscribe(
			(display: any) => {
			}
		);
		
		let timer = Observable.timer(1000, 3000);
		this.subscription = timer.subscribe(() => { this.updateAlerts() });
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
	
	connect() {}
	
	updateAlerts() {
		let now = Date.now();
		this.alerts.length = 0;
		for (var freq in this.alertMap) {
			let alertEntry:any = this.alertMap[freq];
			if (now - alertEntry.timestamp < 180000) {
				let a:any = {
					band: alertEntry.alert.band,
					frequency: alertEntry.alert.frequency,
					timestamp: Logger.dtFormat(new Date(alertEntry.timestamp)),
					front: alertEntry.alert.front,
					side: alertEntry.alert.side,
					rear: alertEntry.alert.rear,
					index: alertEntry.alert.index,
					count: alertEntry.alert.count,
					frontLEDs: new Array(alertEntry.alert.frontLEDCount),
					rearLEDs: new Array(alertEntry.alert.rearLEDCount)
				};
				this.alerts.push(a);
			}	
		}
	}
	
	simulate() {
		this.v1Service.simulate();
	}
}
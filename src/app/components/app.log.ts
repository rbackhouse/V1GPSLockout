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

@Component({
  	selector: 'ons-page',
  	templateUrl: './app.log.html',
  	styleUrls: ['./app.log.css']
})
@Header()
export class LogComponent implements OnInit, OnDestroy {
  	title:string = 'Log';
  	logMsgs:any = [];
  	connected = false;

	constructor(private splitter: OnsSplitterContent,
				private logger: Logger,
				private v1Service: V1Service, 
				private cd: ChangeDetectorRef) {
	}
	
	ngOnInit() {
		this.logger.getLogMsgs(undefined).forEach((logMsg: any) => {
			logMsg.formatedTime = Logger.dtFormat(logMsg.time);
			logMsg.formattedLevel = Logger.levelToString(logMsg.level);
			this.logMsgs.push(logMsg);
		});	
		this.logger.onLogMsg().subscribe(
			(logMsg: any) => {
				logMsg.formatedTime = Logger.dtFormat(logMsg.time);
				logMsg.formattedLevel = Logger.levelToString(logMsg.level);
				this.logMsgs.push(logMsg);
				this.cd.detectChanges();		
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
	
	clear() {
	}
}
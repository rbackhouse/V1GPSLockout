import { Injectable } from '@angular/core';
import { Logger } from './logger.service';

var PouchDB = require("pouchdb");

declare const emit:any;

@Injectable()		
export class DBService {
	private v1db: any;
	
	constructor(private logger: Logger) {
		if (!this.v1db) {
			this.v1db = new PouchDB('V1DB');
			this.logger.log(Logger.INFO, "DB adapter: "+this.v1db.adapter);
			this.setup();
		}
	}
	
	setup() {
		var ddoc = {
			_id: '_design/locationIndex',
			views: {
				byRegion: {
					map: function (doc:any) {
						emit(doc); 
					}.toString()
				}
			}
		};
	/*
		this.v1db.get('locationIndex/byRegion').catch((err:any) => {
			if (err.name === 'not_found') {
				this.v1db.put(ddoc);
			} else {
				throw err;
			}
		}).catch((err:any) => {
			this.logger.log(Logger.INFO, "Failed to add location index "+ err.message);
		});
	*/
		this.v1db.info((err:any, info:any) => {
			if (err) {
				this.logger.log(Logger.ERROR, "Failed to get V1 DB Info ["+err.name+" : "+err.message+"]");
			
			} else {
				this.logger.log(Logger.INFO, "Connected to V1 DB "+info.doc_count+ " records found");
			}	
		});
	/*
		this.v1db.allDocs({
			include_docs: true
		}).then((result: any) => {
			console.log(result);
		}).catch((err: any) => {
			this.logger.log(Logger.ERROR, "Failed to get all alerts from V1 DB ["+err.name+" : "+err.message+"]");
		});
	*/	
	}

	addAlert(alert:any, location:any, timestamp:any) {
		let d = new Date(timestamp);
		this.v1db.get(alert.frequency).catch((err:any) => {
			if (err.name === 'not_found') {
				this.v1db.put({
					_id: alert.frequency, 
					alert: {frequency: alert.frequency, band: alert.band}, 
					locations: [{
						lat: location.latitude, 
						lng: location.longitude, 
						direction: alert.direction, 
						frontSignalStrength: alert.frontSignalStrength,
						rearSignalStrength: alert.rearSignalStrength,
						timestamp: timestamp
					}]
				});
				return {};
			} else {
				throw err;
			}
		}).then((alertDoc:any) => {
			if (alertDoc.alert) {
				let update = false;
				let addLocation = true;
				alertDoc.locations.forEach((l:any) => {
					if (l.lat === location.latitude && l.lng === location.longitude) {
						addLocation = false;
					}
				});
				if (addLocation) {
					alertDoc.locations.push({
						lat: location.latitude, 
						lng: location.longitude, 
						direction: alert.direction, 
						frontSignalStrength: alert.frontSignalStrength,
						rearSignalStrength: alert.rearSignalStrength,
						timestamp: timestamp
					});
					update = true;
				}
				if (update) {
					this.v1db.put(alertDoc);
				}
			}	
		}).catch((err:any) => {
			this.logger.log(Logger.ERROR, "Failed to add alert to V1 DB ["+err.name+" : "+err.message+"]");
		});			
	}
	
	getAlerts(cb:any) {
		this.v1db.allDocs({
			include_docs: true
		}).then((result:any) => {
			let alerts:any = [];
			result.rows.forEach((row:any) => {
				if (row.doc.alert) {
					alerts.push(row.doc);
				}
			});
			cb(undefined, alerts);	  
		}).catch((err:any) => {
			cb(err);
		});			
	}
	
	getAlert(frequency:any, cb:any) {
		this.v1db.get(frequency)
		.then((alertDoc:any) => {
			cb(undefined, alertDoc);
		}).catch((err:any) => {
			this.logger.log(Logger.ERROR, "Failed to get alert ["+err.name+" : "+err.message+"]");
			cb(err);
		});			
	}
	
	clear() {
		this.v1db.destroy().then((response:any) => {
			this.logger.log(Logger.INFO, "V1 DB deleted");
			this.setup();
		}).catch((err:any) => {
			this.logger.log(Logger.ERROR, "Failed to destroy db ["+err.name+" : "+err.message+"]");
		});		
	}
	
	replicate(to:any, cb:any) {
		this.v1db.replicate.to(to, {timeout: 60000}).then((result:any) => {
			this.logger.log(Logger.INFO, "V1 DB copied to "+to);
			cb(undefined, result);
		}).catch((err:any) => {
			this.logger.log(Logger.ERROR, "Failed to copy V1 DB to "+to+" ["+err.name+" : "+err.message+"]");
			cb(err);
		});			
	}
}

/*
* The MIT License (MIT)
* 
* Copyright (c) 2017 Richard Backhouse
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
* to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
* and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
* DEALINGS IN THE SOFTWARE.
*/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Logger } from './logger.service';
import { LocationService } from './location.service';
import { DBService } from './db.service';

"use strict";

const hexChar = ["0", "1", "2", "3", "4", "5", "6", "7","8", "9", "A", "B", "C", "D", "E", "F"];

declare const ble:any;

const simData:any = [
"AA D6 EA 43 08 11 29 18 77 88 88 81 0F AB",
"AA D6 EA 43 08 12 29 18 A2 B6 88 81 69 AB",
"AA D6 EA 43 08 12 29 18 83 95 88 81 29 AB", 
"AA D6 EA 43 08 12 29 19 8B A6 88 81 43 AB", 
"AA D6 EA 43 08 12 29 19 58 95 88 81 FF AB", 
"AA D6 EA 43 08 11 29 19 9D A5 88 81 53 AB", 
"AA D6 EA 43 08 11 29 19 8A 89 28 81 C4 AB", 
"AA D6 EA 43 08 11 29 19 8B 00 28 81 3C AB", 
"AA D6 EA 43 08 12 29 1A 7F A5 88 81 37 AB", 
"AA D6 EA 43 08 11 29 1A 82 87 88 81 1B AB", 
"AA D6 EA 43 08 11 29 1A 95 A0 88 81 47 AB", 
"AA D6 EA 43 08 11 29 1A 8A 00 28 81 3C AB", 
"AA D6 EA 43 08 12 29 1A 47 9A 88 81 F4 AB", 
"AA D6 EA 43 08 11 29 1A 83 00 28 81 35 AB", 
"AA D6 EA 43 08 11 29 1A 8E 00 28 81 40 AB", 
"AA D6 EA 43 08 11 29 1A 4F 83 88 81 E4 AB", 
"AA D6 EA 43 08 12 29 1A 31 86 88 81 CA AB", 
"AA D6 EA 43 08 11 29 1B 8E 00 28 81 41 AB", 
"AA D6 EA 43 08 11 29 1B 92 00 28 81 45 AB", 
"AA D6 EA 43 08 12 29 1B 40 8A 88 81 DE AB", 
"AA D6 EA 43 08 22 29 2C 00 95 88 01 4A AB", 
"AA D6 EA 43 08 22 29 2C 00 9E 88 01 53 AB", 
"AA D6 EA 43 08 22 29 2E 00 9A 88 01 51 AB", 
"AA D6 EA 43 08 22 29 2E 00 7A 88 01 31 AB", 
"AA D6 EA 43 08 22 29 2E 00 99 88 01 50 AB", 
"AA D6 EA 43 08 22 29 2E 00 92 88 01 49 AB", 
"AA D6 EA 43 08 22 29 2F 00 84 88 01 3C AB", 
"AA D6 EA 43 08 22 29 2F 00 72 88 01 2A AB", 
"AA D6 EA 43 08 23 5E 34 9F 00 24 01 2E AB", 
"AA D6 EA 43 08 22 5E 34 92 00 24 01 20 AB", 
"AA D6 EA 43 08 23 5E 36 A0 00 24 81 B1 AB", 
"AA D6 EA 43 08 22 5E 37 A1 00 24 81 B2 AB", 
"AA D6 EA 43 08 22 5E 4D 76 00 24 81 9D AB", 
"AA D6 EA 43 08 22 5E 4F 9B 00 24 81 C4 AB", 
"AA D6 EA 43 08 22 5E 4F 94 00 24 81 BD AB", 
"AA D6 EA 43 08 22 5E 50 58 88 24 01 8A AB", 
"AA D6 EA 43 08 22 5E 50 4F 7F 24 01 78 AB", 
"AA D6 EA 43 08 11 5E 50 31 61 84 81 0B AB", 
"AA D6 EA 43 08 33 5E 52 9A 00 24 01 57 AB", 
"AA D6 EA 43 08 33 5E 55 9D 00 24 01 5D AB", 
"AA D6 EA 43 08 12 5E 5D 6E 5C 24 01 71 AB", 
"AA D6 EA 43 08 12 5E 5F 8F 7D 24 01 B5 AB", 
"AA D6 EA 43 08 12 5E 5F 8C 7A 24 01 AF AB", 
"AA D6 EA 43 08 11 5E 5F 5C 88 24 81 0C AB", 
"AA D6 EA 43 08 12 5E 5F 7A 8A 44 81 4D AB", 
"AA D6 EA 43 08 11 5E 5F 84 00 24 81 AC AB", 
"AA D6 EA 43 08 11 5E 5F 9A 00 24 81 C2 AB", 
"AA D6 EA 43 08 13 5E 5F A3 00 24 81 CD AB", 
"AA D6 EA 43 08 11 5E 62 A0 8C 24 81 57 AB", 
"AA D6 EA 43 08 11 5E 62 8E 00 24 81 B9 AB", 
"AA D6 EA 43 08 11 5E 62 95 00 24 81 C0 AB", 
"AA D6 EA 43 08 11 5E 62 88 00 24 81 B3 AB", 
"AA D6 EA 43 08 11 5E 62 73 79 44 81 37 AB", 
"AA D6 EA 43 08 12 5E 62 94 9B 24 81 5B AB", 
"AA D6 EA 43 08 11 5E 64 8C 00 24 81 B9 AB", 
"AA D6 EA 43 08 14 5E 69 89 00 24 01 3E AB", 
"AA D6 EA 43 08 11 5E 6C 91 00 24 81 C6 AB", 
"AA D6 EA 43 08 13 5E 6C 73 00 24 01 2A AB", 
"AA D6 EA 43 08 15 5E 6C 98 00 24 01 51 AB", 
"AA D6 EA 43 08 13 5E 6C 82 00 24 01 39 AB", 
"AA D6 EA 43 08 15 5E 6C 95 00 24 01 4E AB", 
"AA D6 EA 43 08 13 5E 6C 9A 00 24 01 51 AB", 
"AA D6 EA 43 08 13 5E 6F 88 00 24 01 42 AB", 
"AA D6 EA 43 08 33 5E 71 9C 00 24 01 78 AB", 
"AA D6 EA 43 08 33 5E 71 99 00 24 01 75 AB", 
"AA D6 EA 43 08 55 5E 71 7B 00 24 01 79 AB", 
"AA D6 EA 43 08 34 5E 74 9E 00 24 81 FE AB", 
"AA D6 EA 43 08 11 5E 75 58 77 84 81 6D AB", 
"AA D6 EA 43 08 11 5E 75 70 8F 44 81 5D AB", 
"AA D6 EA 43 08 11 5E 76 76 8B 24 81 40 AB", 
"AA D6 EA 43 08 33 5E 76 9A 00 24 81 FB AB", 
"AA D6 EA 43 08 33 5E 76 A0 00 24 81 01 AB", 
"AA D6 EA 43 08 33 5E 76 94 8A 24 81 7F AB", 
"AA D6 EA 43 08 33 5E 76 97 8B 24 81 83 AB", 
"AA D6 EA 43 08 33 5E 79 9F 00 24 81 03 AB", 
"AA D6 EA 43 08 33 5E 79 9D 00 24 81 01 AB", 
"AA D6 EA 43 08 23 5E 79 A5 00 24 81 F9 AB", 
"AA D6 EA 43 08 35 5E 79 A4 00 24 81 0A AB", 
"AA D6 EA 43 08 33 5E 79 A3 8C 24 81 93 AB", 
"AA D6 EA 43 08 34 5E 7B A1 00 24 81 08 AB", 
"AA D6 EA 43 08 11 5E 7D 8E 00 24 81 D4 AB", 
"AA D6 EA 43 08 11 5E 7D 93 00 24 81 D9 AB", 
"AA D6 EA 43 08 11 5E 7D 8E 00 24 81 D4 AB", 
"AA D6 EA 43 08 11 5E 7E 92 00 24 81 D9 AB", 
"AA D6 EA 43 08 11 5E 7E 74 00 24 81 BB AB", 
"AA D6 EA 43 08 11 5E 7E 93 00 24 81 DA AB", 
"AA D6 EA 43 08 11 5E 7E 9D 00 24 81 E4 AB", 
"AA D6 EA 43 08 44 5E 7E 70 00 24 01 6A AB", 
"AA D6 EA 43 08 11 5E 7E 94 00 24 81 DB AB", 
"AA D6 EA 43 08 11 5E 7E 79 00 24 81 C0 AB", 
"AA D6 EA 43 08 11 5E 80 91 00 24 81 DA AB", 
"AA D6 EA 43 08 11 5E 80 8F 00 24 81 D8 AB", 
"AA D6 EA 43 08 11 5E 80 96 00 24 81 DF AB", 
"AA D6 EA 43 08 11 5E 80 95 00 24 81 DE AB", 
"AA D6 EA 43 08 44 5E 80 8B 00 24 01 87 AB", 
"AA D6 EA 43 08 24 5E 88 96 00 24 01 7A AB", 
"AA D6 EA 43 08 22 5E 8B 97 00 24 81 FC AB", 
"AA D6 EA 43 08 23 5E 8B 7F 00 24 01 65 AB", 
"AA D6 EA 43 08 13 5E 8B 95 00 24 01 6B AB", 
"AA D6 EA 43 08 23 5E 8B 7B 00 24 01 61 AB", 
"AA D6 EA 43 08 24 5E 8B AD 00 24 81 14 AB", 
"AA D6 EA 43 08 23 5E 8B 97 00 24 01 7D AB", 
"AA D6 EA 43 08 24 5E 8D 89 00 24 01 72 AB", 
"AA D6 EA 43 08 25 5E 8D A4 00 24 01 8E AB" 
];

class V1Connection {
	id:any = "";
	serviceId:any = "";
	characteristic:any = "";
	writeCharacteristic:any = "";
	listeners:any = [];
	errListeners:any = [];
	connected = false;
	device:any;
	currDisplay:any;
	currAlert:any;
	name: any;
	
	constructor(id:any) {
		this.id = id;
		this.serviceId = "92A0AFF4-9E05-11E2-AA59-F23C91AEC05E";
		this.characteristic = "92A0B2CE-9E05-11E2-AA59-F23C91AEC05E";
		this.writeCharacteristic = "92A0B6D4-9E05-11E2-AA59-F23C91AEC05E";
		this.listeners = [];
		this.errListeners = [];
	}
	
	connect(cb:any) {
		ble.connect(this.id, 
			(device:any) => {
				console.log("Connected to V1");
				this.listeners.forEach((listener:any) => {
					listener({state: {connected : true}});
				});
				
				this.name = device.name;
				this.device = device;
				this.connected = true;
				this.startListening();
				this.startAlerts();
				this.getVersion();
				this.getSerialNum();
				cb();
			}, 
			(err:any) => {
				this.handleError(err);
			}
		);	
	}
	
	disconnect() {
		if (this.connected) {
			this.listeners.forEach((listener:any) => {
				listener({state: {connected : false}});
			});
	
			this.stopListening();
			ble.disconnect(this.id);
			this.device = undefined;
			this.connected = false;
		}	
	}
	
	isConnected() {
		return this.connected;
	}
	
	startListening() {
		ble.startNotification(this.device.id, this.serviceId, this.characteristic, 
			(buffer:any) => {
				this.handleNotifactionResponse(buffer);
			},
			(err:any) => {
				this.handleError(err);
			}
		);
	}
	
	stopListening() {
		ble.stopNotification(this.device.id, this.serviceId, this.characteristic, 
			() => {
				console.log("Stopped V1 listening");
			}, 
			(err:any) => {
				this.handleError(err);
			}
		);
	}
	
	startAlerts() {
		let cmdData = V1Connection.packageCMDValue(0x41);
		ble.writeWithoutResponse(this.device.id, this.serviceId, this.writeCharacteristic, cmdData.buffer, 
			() => {
				console.log("Alerts started");
			},
			(err:any) => {
				this.handleError(err);
			}
		);
	}
	
	stopAlerts() {
		let cmdData = V1Connection.packageCMDValue(0x42);
		ble.writeWithoutResponse(this.device.id, this.serviceId, this.writeCharacteristic, cmdData.buffer, 
			() => {
				console.log("Alerts stopped");
			},
			(err:any) => {
				this.handleError(err);
			}
		);
	}
	
	getVersion() {
		let cmdData = V1Connection.packageCMDValue(0x01);
		ble.writeWithoutResponse(this.device.id, this.serviceId, this.writeCharacteristic, cmdData.buffer, 
			() => {
			},
			(err:any) => {
				this.handleError(err);
			}
		);
	}
	
	getSerialNum() {
		let cmdData = V1Connection.packageCMDValue(0x03);
		ble.writeWithoutResponse(this.device.id, this.serviceId, this.writeCharacteristic, cmdData.buffer, 
			() => {
			},
			(err:any) => {
				this.handleError(err);
			}
		);
	}
	
	addListener(listener:any) {
		this.listeners.push(listener);
	}
	
	removeListener(listener:any) {
		var index = this.listeners.indexOf(listener);
		if (index > -1) {
			this.listeners.splice(index, 1);
		}
	}
	
	addErrorListener(listener:any) {
		this.errListeners.push(listener);
	}
	
	removeErrorListener(listener:any) {
		var index = this.errListeners.indexOf(listener);
		if (index > -1) {
			this.errListeners.splice(index, 1);
		}
	}
	
	handleError(err:any) {
		this.errListeners.forEach((listener:any) => {
			listener(err);
		});
	}
	
	handleNotifactionResponse(buffer:any) {
		let data = new Uint8Array(buffer);
		let dataStr = V1Connection.arrayToStr(data);
		let result;
		switch (data[3]) {
			case 0x02:
				this.listeners.forEach((listener:any) => {
					listener({version : dataStr});
				});
				break;	
			case 0x04:
				this.listeners.forEach((listener:any) => {
					listener({serialNum : dataStr});
				});
				break;	
			case 0x31:
				if (!this.currDisplay || dataStr !== this.currDisplay) {
					this.currDisplay = dataStr;
					this.listeners.forEach((listener:any) => {
						listener({display : V1Connection.toDisplay(dataStr)});
					});
				}
				break;
			case 0x43:
				if (!this.currAlert || dataStr !== this.currAlert) {
					this.currAlert = dataStr;
					this.listeners.forEach((listener:any) => {
						listener({alert : V1Connection.toAlert(dataStr)});
					});
				}
				break;	
			default:
				this.listeners.forEach((listener:any) => {
					listener({response : {id: data[3], data: dataStr}});
				});
				break;	
		}
	}
	
	static packageCMDValue(value:any) {
		let checksum = (0xAA+0xDA+0xE6+value+0x01) & 0xFF;
		return new Uint8Array([0xAA, 0xDA, 0xE6, value, 0x01, checksum, 0xAB]);
	}
	
	static arrayToStr(hex:any) {
		let dataStr = '';
		for (var i = 0; i < hex.length; i++) {
			dataStr += hexChar[(hex[i] >> 4) & 0x0f] + hexChar[hex[i] & 0x0f];
			dataStr += ' ';
		}
		return dataStr;
	}
	
	static byteToHex(b:any) {
		return hexChar[(b >> 4) & 0x0f] + hexChar[b & 0x0f];
	}
	
	static hex2bin(hex:any) {
		return parseInt(hex,16).toString(2);
	}

	static hex2dec(hex:any) {
		return parseInt(parseInt(hex,16).toString(10));
	}
	
	static hex2LowNibble(hex:any) {
		var intValue = parseInt(hex,16) & 0xFF;
		return intValue & 0xF;
	}

	static hex2HighNibble(hex:any) {
		var intValue = parseInt(hex,16) & 0xFF;
		return intValue >> 4;
	}
	
	static scan(cb:any) {
		ble.startScan([], 
			(device:any) => {
				if (device.advertising && device.advertising.kCBAdvDataLocalName) {
					var name = device.advertising.kCBAdvDataLocalName;
					if (name === "V1connection LE") {
						cb(undefined, device);
					}
				}	
			}, 
			(err:any) => {
				cb(err);
			}
		);
	}
	
	static toDisplay(rawDisplay:any) {
		let split = rawDisplay.split(" ");
		let display = {
			bogeyCounter1: V1Connection.hex2bin(split[5]),
			bogeyCounter2: V1Connection.hex2bin(split[6]),
			signalStrength: V1Connection.hex2bin(split[7]),
			bandAndArrow1: V1Connection.hex2bin(split[8]),
			bandAndArrow2: V1Connection.hex2bin(split[9]),
			raw: rawDisplay
		};
		return display;	
	}
	
	static toAlert(rawAlert:any) {
		let split = rawAlert.split(" ");
		let alert = {
			index: 0,
			count: 0,
			frequency: "",
			frontSignalStrength: 0,
			rearSignalStrength: 0,
			bandAndDirection: "",
			laser: false,
			ka: false,
			k: false,
			x: false,
			ku: false,
			front: false,
			side: false,
			rear: false,
			band: "",
			frontLEDCount: 0,
			rearLEDCount: 0,
			direction: "",
			raw: ""
		};
		alert.index = V1Connection.hex2HighNibble(split[5]);
		alert.count = V1Connection.hex2LowNibble(split[5]);
		alert.frequency = (V1Connection.hex2dec(split[6]+split[7]) / 1000).toPrecision(5);
		alert.frontSignalStrength = split[8];
		let front = V1Connection.hex2dec(alert.frontSignalStrength);
		alert.rearSignalStrength = split[9];
		let rear = V1Connection.hex2dec(alert.rearSignalStrength);
		let ba = V1Connection.hex2bin(split[10]);
		let pad = 8 - ba.length;
		for (var i = 0; i < pad; i++) {
			ba = "0"+ba;
		}
		alert.bandAndDirection = ba;
		alert.laser = ba.charAt(7) == "1";
		alert.ka = ba.charAt(6) == "1";
		alert.k = ba.charAt(5) == "1";
		alert.x = ba.charAt(4) == "1";
		alert.ku = ba.charAt(3) == "1";
		alert.front = ba.charAt(2) == "1";
		alert.side = ba.charAt(1) == "1";
		alert.rear = ba.charAt(0) == "1";
		if (alert.laser) {
			alert.band = "Laser";
		} else if (alert.ka) {
			alert.band = "Ka";
			alert.frontLEDCount = V1Connection.convertKaSignal(front);
			alert.rearLEDCount = V1Connection.convertKaSignal(rear);
		} else if (alert.k) {
			alert.band = "K";
			alert.frontLEDCount = V1Connection.convertKSignal(front);
			alert.rearLEDCount = V1Connection.convertKSignal(rear);
		} else if (alert.x) {
			alert.band = "X";
			alert.frontLEDCount = V1Connection.convertXSignal(front);
			alert.rearLEDCount = V1Connection.convertXSignal(rear);
		} else if (alert.ku) {
			alert.band = "Ku";
			alert.frontLEDCount = V1Connection.convertKSignal(front);
			alert.rearLEDCount = V1Connection.convertKSignal(rear);
		}
		if (alert.front) {
			alert.direction = "front";
		} else if (alert.side) {
			alert.direction = "side";
		} else if (alert.rear) {
			alert.direction = "rear";
		}
		alert.raw = rawAlert;
		return alert;		
	}
	
	static convertKaSignal(signalStrength:any) {
		if (signalStrength > 0 && signalStrength < 144) {
			return 1;
		} else if (signalStrength > 143 && signalStrength < 151) {
			return 2;
		} else if (signalStrength > 150 && signalStrength < 158) {
			return 3;
		} else if (signalStrength > 157 && signalStrength < 165) {
			return 4;
		} else if (signalStrength > 164 && signalStrength < 172) {
			return 5;
		} else if (signalStrength > 171 && signalStrength < 179) {
			return 6;
		} else if (signalStrength > 178 && signalStrength < 186) {
			return 7;
		} else if (signalStrength > 185 && signalStrength < 255) {
			return 8;
		} else {
			return 0;
		}
	}
	
	static convertKSignal(signalStrength:any) {
		if (signalStrength > 0 && signalStrength < 136) {
			return 1;
		} else if (signalStrength > 135 && signalStrength < 144) {
			return 2;
		} else if (signalStrength > 143 && signalStrength < 154) {
			return 3;
		} else if (signalStrength > 153 && signalStrength < 164) {
			return 4;
		} else if (signalStrength > 163 && signalStrength < 174) {
			return 5;
		} else if (signalStrength > 173 && signalStrength < 184) {
			return 6;
		} else if (signalStrength > 183 && signalStrength < 194) {
			return 7;
		} else if (signalStrength > 193 && signalStrength < 255) {
			return 8;
		} else {
			return 0;
		}
	}
	
	static convertXSignal(signalStrength:any) {
		if (signalStrength > 0 && signalStrength < 150) {
			return 1;
		} else if (signalStrength > 149 && signalStrength < 160) {
			return 2;
		} else if (signalStrength > 159 && signalStrength < 170) {
			return 3;
		} else if (signalStrength > 169 && signalStrength < 180) {
			return 4;
		} else if (signalStrength > 179 && signalStrength < 189) {
			return 5;
		} else if (signalStrength > 188 && signalStrength < 197) {
			return 6;
		} else if (signalStrength > 196 && signalStrength < 208) {
			return 7;
		} else if (signalStrength > 207 && signalStrength < 255) {
			return 8;
		} else {
			return 0;
		}
	}
}


@Injectable()		
export class V1Service {
	private alerts: BehaviorSubject<{}> = new BehaviorSubject<{}>({});
	private displays: BehaviorSubject<{}> = new BehaviorSubject<{}>({});
	private state: BehaviorSubject<{}> = new BehaviorSubject<{}>({connected:false});
	private v1Connection:any;
	private alertMap = {};
	
	constructor(private logger: Logger,
				private locationService: LocationService,
				private DB: DBService) {
		this.scan();
	}

	onAlert(): Observable<{}> {
    	return this.alerts.asObservable();
  	}
  	
  	onDisplay(): Observable<{}> {
    	return this.displays.asObservable();
  	}
  	
  	onStateChange(): Observable<{}> {
    	return this.state.asObservable();
  	}
  	
	getAlertMap() {
		return this.alertMap;
	}
	
	simulate() {
		let i = 0;
						
		let sim = () => {
			let alert = V1Connection.toAlert(simData[i]);
			this.alertMap[alert.frequency] = {alert: alert, current: this.locationService.getLocation(), timestamp: Date.now()};
			//this.alerts.next(this.alertMap[alert.frequency]);
			this.DB.addAlert(alert, this.alertMap[alert.frequency].current, this.alertMap[alert.frequency].timestamp);
			i++;
			if (i < simData.length) {
				setTimeout(sim, 1500);
			} else {
				console.log("simulate complete");
			}
		};
		sim();
	}
	
	scan() {
		V1Connection.scan((err:any, device:any) => {
			if (!err) {
				this.v1Connection = new V1Connection(device.id);
				this.v1Connection.addListener((v1data:any) => {
					if (v1data.alert && v1data.alert.index) {
						let timestamp = Date.now();
						let location = this.locationService.getLocation();
						if (location && v1data.alert.index > 0) {
							this.DB.addAlert(v1data.alert, location, timestamp);
						}
						this.alertMap[v1data.alert.frequency] = {alert: v1data.alert, current: location, timestamp: timestamp};
						this.alerts.next(this.alertMap[v1data.alert.frequency]);
					} else if (v1data.display) {
						this.displays.next(v1data.display);
					} else if (v1data.state) {
						this.state.next(v1data.state);
					}
				});
				this.v1Connection.addErrorListener((err:any) => {
					this.v1Connection.disconnect();
					this.v1Connection.connect(() => {
						this.logger.log(Logger.INFO, "V1 Connected");
					});
				});
				this.v1Connection.connect(() => {
					this.logger.log(Logger.INFO, "V1 Connected");
				});
			} else {
				this.logger.log(Logger.INFO, "V1 not connected : "+err);
			}
		});
	}
}

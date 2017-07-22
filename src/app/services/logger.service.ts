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

@Injectable()		
export class Logger {
	logMsgs:any = [];
	private notifications: BehaviorSubject<{}> = new BehaviorSubject<{}>({});
	
	log(level:any, msg:any) {
		var logMsg = {time: new Date(), msg: msg, level: level};
		this.logMsgs.push(logMsg);
		this.notifications.next(logMsg);
	}

	onLogMsg(): Observable<{}> {
    	return this.notifications.asObservable();
  	}
  	
	getLogMsgs(level:any) : Array<any> {
		if (level) {
			let msgs:any = [];
			this.logMsgs.forEach((msg:any) => {
				if (msg.level === level) {
					msgs.push(msg);
				}
			});
			return msgs;
		} else {
			return this.logMsgs;
		}
	}
	
	static get ERROR() {
		return 1;
	}
	
	static get WARN() {
		return 2;
	}
	
	static get INFO() {
		return 3;
	}
	
	static get TRACE() {
		return 4;
	}
	
	static levelToString(level:any) {
		switch (level) {
			case Logger.ERROR: 
				return "ERROR";
			case Logger.WARN: 
				return "WARN";
			case Logger.INFO: 
				return "INFO";
			case Logger.TRACE: 
				return "TRACE";
		}
	}
	
	static dtFormat(d:any) {
		function pad(val:any) {
			val = val + "";
			if (val.length == 1) {
				val = "0" + val;
			}
			return val;
		}
		var month = pad(d.getMonth()+1);
		var day = pad(d.getDate());
		var hour = d.getHours();
		var ampm;
		if (hour < 12) {
			ampm = "AM";
		} else {
			ampm = "PM";
		}
		if (hour == 0) {
			hour = 12;
		}
		if (hour > 12) {
			hour = hour - 12;
		}

		var mins = pad(d.getMinutes());
		var secs = pad(d.getSeconds());
		return d.getFullYear()+"-"+month+"-"+day+" "+hour+":"+mins+":"+secs+ " "+ampm;
	}
}
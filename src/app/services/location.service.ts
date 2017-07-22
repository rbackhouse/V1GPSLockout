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
import { Logger } from './logger.service';
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare const locationService:any;

@Injectable()		
export class LocationService {
	currentPos:any;
	private locations: BehaviorSubject<{}> = new BehaviorSubject<{}>({});
	
	constructor(private logger: Logger) {
		locationService.addListener((pos:any) => {
			this.currentPos = pos;
			this.locations.next(pos);
			//this.logger.log(Logger.INFO, "Location "+pos.latitude+ " : "+pos.longitude);
		});
	}
	
	onLocationChange(): Observable<{}> {
    	return this.locations.asObservable();
  	}
	
	getLocation() {
		return this.currentPos;
	}
}
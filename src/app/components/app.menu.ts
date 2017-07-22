import {
  Component,
  OnsSplitterSide,
  OnsenModule,
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA
} from 'ngx-onsenui';

import { AlertsComponent } from './app.alerts';
import { DatabaseComponent } from './app.database';
import { LogComponent } from './app.log';

@Component({
  	selector: 'ons-page',
  	templateUrl: './app.menu.html',
  	styleUrls: ['./app.menu.css']
})
export class MenuComponent {

	constructor(private splitter: OnsSplitterSide) {}
  
	changeContent(id: string) {
		switch (id) {
			case "alerts":
				this.splitter.element.parentElement.content.load(AlertsComponent);
				this.splitter.element.close();
				break;
			case "database":
				this.splitter.element.parentElement.content.load(DatabaseComponent);
				this.splitter.element.close();
				break;
			case "log":
				this.splitter.element.parentElement.content.load(LogComponent);
				this.splitter.element.close();
				break;
		}
	}
}
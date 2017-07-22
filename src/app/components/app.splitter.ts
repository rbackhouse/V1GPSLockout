import {
	Component,
	OnsSplitterContent,
  	OnsenModule,
  	NgModule,
  	onsNotification,
  	CUSTOM_ELEMENTS_SCHEMA
} from 'ngx-onsenui';

import { AlertsComponent } from './app.alerts';
import { MenuComponent } from './app.menu';

@Component({
	selector: 'app',
	templateUrl: './app.splitter.html'
})
export class AppSplitter {
	menu = MenuComponent;
  	content = AlertsComponent;
}
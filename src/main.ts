import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app/components/app.module';

if (process.env.ENV === 'production') {
  enableProdMode();
}

document.addEventListener("deviceready", (evt:any) => {
	platformBrowserDynamic().bootstrapModule(AppModule);
});

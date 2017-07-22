LocationServicePlugin
================

Location Service Plugin for iOS. It will attempt to obtain the Geolocation in both background and foreground mode

Install
-------
`cordova plugin add https://github.com/rbackhouse/LocationServicePlugin.git`

Usage
-----

```
	locationService.addListener(function(pos) {
		console.log("Location ["+pos.latitude+", "+pos.longitude+", "+pos.inBackground+"]");
	});
```


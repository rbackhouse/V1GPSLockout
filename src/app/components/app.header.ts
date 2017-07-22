export function Header(): ClassDecorator {
	return function ( constructor : any ) {
		constructor.prototype.openMenu = function () {
			this.splitter.element.parentElement.side.open();
		}
	}
}
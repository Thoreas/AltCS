document.addEventListener("keypress", discardReturns);

function discardReturns(e) {
	if ( e.which == 13 ) {
		e.preventDefault();
	}
};
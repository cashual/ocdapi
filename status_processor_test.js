const sp = require('./status_processor');

let reds = sp.getReds('gCashAPI');
console.log(reds);
console.log(sp.getControlInfo('gCashAPI', 'FC01.1'));

sp.updateControl({
    applicationId: 'gCashAPI',
    controlId: 'FC01.1',
    statusControl: 'yellow'
});

console.log(sp.getControlInfo('gCashAPI', 'FC01.1'));

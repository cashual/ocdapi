const fs = require('fs');
const dt = require('date-and-time');

const applications = JSON.parse(fs.readFileSync('ocd_status.json'));

const transformControl = control => {
    return {
        controlId: control.controlId, 
        riskArea: control.riskArea ,
        lastUpdated: control.lastUpdated,
        expiringOn: control.expiringOn,
        statusControl: control.statusControl
    }
}

const getReds = appId => {
    return applications[appId]
    .controls.filter(control => control.statusControl === 'red')
    .map(transformControl);
}

const getControlInfo = (appId, controlId) => {
    return applications[appId]
    .controls
    .filter(control => control.controlId === controlId)
    .map(transformControl)[0];
}

const DATE_FMT = 'YYYY-MM-DD';

const updateControl = (info) => {
    const ctrl = applications[info.applicationId]
    .controls.filter(control => control.controlId === info.controlId)[0];

    Object.assign(ctrl, info);
    const now = new Date();
    ctrl.expiringOn = dt.format(dt.addMonths(now, parseInt(ctrl.validity, 10)), DATE_FMT);
    ctrl.lastUpdated = dt.format(now, DATE_FMT);    
}

module.exports = {
    getControlInfo: getControlInfo,
    getReds: getReds,
    updateControl: updateControl
}


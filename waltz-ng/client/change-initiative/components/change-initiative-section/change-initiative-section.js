import {CORE_API} from '../../../common/services/core-api-utils';
import {initialiseData} from '../../../common';

import template from './change-initiative-section.html';


const bindings = {
    parentEntityRef: '<',
};


const initialState = {
    changeInitiatives: [],
    visibility: {
        sourcesOverlay: false
    }
};


function controller(serviceBroker) {
    const vm = initialiseData(this, initialState);

    vm.$onChanges = () => {
        if(vm.parentEntityRef) {
            let promise = null;
            if (vm.parentEntityRef.kind === 'PERSON') {
                promise = serviceBroker
                    .loadViewData(CORE_API.PersonStore.getById, [vm.parentEntityRef.id])
                    .then(person => serviceBroker.loadViewData(
                        CORE_API.InvolvementStore.findChangeInitiativesForEmployeeId,
                        [person.data.employeeId]));
            } else {
                promise = serviceBroker.loadViewData(
                    CORE_API.ChangeInitiativeStore.findByRef,
                    [vm.parentEntityRef.kind, vm.parentEntityRef.id])
            }

            promise
                .then(result => vm.changeInitiatives = result.data);
        }
    }

}


controller.$inject = [
    'ServiceBroker'
];


const component = {
    template,
    bindings,
    controller
};


export default {
    component,
    id: 'waltzChangeInitiativeSection'
};

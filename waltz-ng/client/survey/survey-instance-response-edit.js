/*
 * Waltz - Enterprise Architecture
 * Copyright (C) 2016  Khartec Ltd.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import {initialiseData} from "../common/index";
import {groupQuestions} from "./survey-utils";
import _ from "lodash";


const initialState = {
    isUserInstanceRecipient: false,
    instanceCanBeEdited: false,
    surveyInstance: {},
    surveyQuestionInfos: [],
    surveyResponses: {},
    user: {}
};


const template = require('./survey-instance-response-edit.html');


function indexResponses(responses = []) {
    return _.chain(responses)
        .map(r => r.questionResponse)
        .map(qr => {
            if (!_.isNil(qr.booleanResponse) && !_.isString(qr.booleanResponse)) {
                qr.booleanResponse = qr.booleanResponse
                    ? 'true'
                    : 'false';
            }
            return qr;
        })
        .keyBy('questionId')
        .value();
}



function controller($location,
                    $state,
                    $stateParams,
                    notification,
                    surveyInstanceStore,
                    surveyRunStore,
                    surveyQuestionStore,
                    userService) {

    const vm = initialiseData(this, initialState);

    const id = $stateParams.id;

    const instancePromise  = surveyInstanceStore
        .getById(id)
        .then(r => {
            vm.instanceCanBeEdited = (r.status === 'NOT_STARTED' || r.status === 'IN_PROGRESS');
            vm.surveyInstance = r;
            return r;
        });

    instancePromise
        .then(instance => surveyRunStore.getById(instance.surveyRunId))
        .then(sr => vm.surveyRun = sr);

    surveyQuestionStore
        .findForInstance(id)
        .then(qis => vm.surveyQuestionInfos = groupQuestions(qis));

    Promise
        .all([userService.whoami(), surveyInstanceStore.findRecipients(id)])
        .then(([user = {}, recipients = []]) => {
            vm.user = user;
            const [currentRecipients = [], otherRecipients = []] = _.partition(recipients,
                r => r.person.email === user.userName);

            vm.isUserInstanceRecipient = currentRecipients.length > 0;
            vm.otherRecipients = otherRecipients.map(r => r.person);
        });

    surveyInstanceStore
        .findResponses(id)
        .then(rs => vm.surveyResponses = indexResponses(rs));


    vm.surveyInstanceLink = encodeURIComponent(
        _.replace($location.absUrl(), '#' + $location.url(), '')
        + $state.href('main.survey.instance.view', {id: id}));

    vm.saveResponse = (questionId) => {
        surveyInstanceStore.saveResponse(
            vm.surveyInstance.id,
            Object.assign({'questionId': questionId}, vm.surveyResponses[questionId])
        );
    };

    vm.saveEntityRespone = (questionId, entity) => {
        vm.surveyResponses[questionId] = {
            entityResponse: {
                id: entity.id,
                kind: entity.kind,
                name: entity.name
            }
        };
        vm.saveResponse(questionId);
    };

    vm.saveComment = (questionId, valObj) => {
        if (! vm.surveyResponses[questionId]) {
            vm.surveyResponses[questionId] = {};
        }
        vm.surveyResponses[questionId].comment = valObj.newVal;

        return surveyInstanceStore.saveResponse(
            vm.surveyInstance.id,
            Object.assign({'questionId': questionId}, vm.surveyResponses[questionId])
        );
    };

    vm.saveForLater = () => {
        notification.success('Survey response saved successfully');
        $state.go('main.survey.instance.user');
    };

    vm.submit = () => {
        if (confirm('The survey cannot be edited once submitted. Are you sure you want to submit your responses?')) {
            surveyInstanceStore.updateStatus(
                vm.surveyInstance.id,
                {newStatus: 'COMPLETED'}
            )
            .then(result => {
                notification.success('Survey response submitted successfully');
                $state.go('main.survey.instance.response.view', {id: id});
            });
        }
    };

}

controller.$inject = [
    '$location',
    '$state',
    '$stateParams',
    'Notification',
    'SurveyInstanceStore',
    'SurveyRunStore',
    'SurveyQuestionStore',
    'UserService'
];


export default {
    template,
    controller,
    controllerAs: 'ctrl'
};


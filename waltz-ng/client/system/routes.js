

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

const baseState = {
    url: 'system'
};


const listViewState = {
    url: '/list',
    views: { 'content@': require('./system-admin-list') }
};


const settingsState = {
    url: '/settings',
    views: { 'content@': require('./settings-view') }
};


const hierarchiesState = {
    url: '/hierarchies',
    views: { 'content@': require('./hierarchies-view') }
};


const orphansState = {
    url: '/orphans',
    views: { 'content@': require('./orphans-view') }
};


const recalculateState = {
    url: '/recalculate',
    views: { 'content@': require('./recalculate-view') }
};


const actorsState = {
    url: '/actors',
    views: { 'content@': require('./actors-view') }
};


const entityNamedNodeTypesState = {
    url: '/entity-named-note-types',
    views: { 'content@': require('./entity-named-node-types-view') }
};


const involvementKindsState = {
    url: '/involvement-kinds',
    views: { 'content@': require('./involvement-kinds-view') }
};


const perspectivesState = {
    url: '/perspectives',
    views: { 'content@': require('./perspectives-view') }
};


const staticPanelsState = {
    url: '/static-panels',
    views: { 'content@': require('./static-panels-view') }
};


function setupRoutes($stateProvider) {
    $stateProvider
        .state('main.system', baseState)
        .state('main.system.list', listViewState)
        .state('main.system.settings', settingsState)
        .state('main.system.hierarchies', hierarchiesState)
        .state('main.system.orphans', orphansState)
        .state('main.system.actors', actorsState)
        .state('main.system.entity-named-note-types', entityNamedNodeTypesState)
        .state('main.system.involvement-kinds', involvementKindsState)
        .state('main.system.perspectives', perspectivesState)
        .state('main.system.static-panels', staticPanelsState)
        .state('main.system.recalculate', recalculateState);
}


setupRoutes.$inject = ['$stateProvider'];


export default setupRoutes;


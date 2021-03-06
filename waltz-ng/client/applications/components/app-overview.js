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

import _ from "lodash";

import template from "./app-overview.html";

const bindings = {
    app: '<',
    tags: '<',
    aliases: '<',
    organisationalUnit: '<',
    complexity: '<',
    onSaveAliases: '<',
    onSaveTags: '<'
};


const initialState = {
    visibility: {
        aliasEditor: false,
        tagEditor: false
    }
};


function controller($state) {
    const vm = _.defaultsDeep(this, initialState);

    vm.$onChanges = () => {
        if (vm.app && vm.app.id) {
            vm.entityRef = {
                kind: 'APPLICATION',
                id: vm.app.id
            };
        }
    };

    vm.showAliasEditor = () => vm.visibility.aliasEditor = true;
    vm.showTagEditor = () => vm.visibility.tagEditor = true;

    vm.dismissAliasEditor = () =>  vm.visibility.aliasEditor = false;
    vm.dismissTagEditor = () => vm.visibility.tagEditor = false;

    vm.tagSelected = (keyword) => {
        const params = { tag: keyword };
        $state.go('main.entity-tag.explorer', params);
    };

    vm.saveAliases = (aliases = []) => {
        vm.onSaveAliases(aliases)
            .then(() => vm.dismissAliasEditor());
    };

    vm.saveTags = (tags = []) => {
        vm.onSaveTags(tags)
            .then(() => vm.dismissTagEditor());
    };
}

controller.$inject = ['$state'];


const component = {
    template,
    bindings,
    controller
};


export default component;


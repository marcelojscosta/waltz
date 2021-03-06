/*
 *
 *  * Waltz - Enterprise Architecture
 *  * Copyright (C) 2017  Khartec Ltd.
 *  *
 *  * This program is free software: you can redistribute it and/or modify
 *  * it under the terms of the GNU Lesser General Public License as published by
 *  * the Free Software Foundation, either version 3 of the License, or
 *  * (at your option) any later version.
 *  *
 *  * This program is distributed in the hope that it will be useful,
 *  * but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  * GNU Lesser General Public License for more details.
 *  *
 *  * You should have received a copy of the GNU Lesser General Public License
 *  * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import _ from "lodash";
import moment from "moment";
import stringify from "json-stable-stringify";

import {initialiseData} from "../../common";
import {checkIsArray, checkIsServiceBrokerOptions, checkIsServiceBrokerTarget} from "../checks";

const initialState = {
    viewData: new Map(),
    appData: new Map(),
    viewDataCacheRefreshListeners: new Map(), // cacheKey -> Set{handler1, handler2...}
    appDataCacheRefreshListeners: new Map(), // cacheKey -> Set{handler1, handler2...}
};


function getFunction(service, serviceName, serviceFnName) {
    const serviceFn = service[serviceFnName];
    if (serviceFn && _.isFunction(serviceFn)) {
        return serviceFn;
    }
    throw serviceName + "." + serviceFnName + " not found!"
}


function createKey(serviceName, serviceFnName, targetParams) {
    return serviceName + "_" + serviceFnName + "_" + stringify(targetParams);
}


function mkCacheValue(promise) {
    return {
        promise,
        lastRefreshed: moment()
    }
}


function notifyListeners(cacheKey, cacheRefreshListenersMap, target, targetParams, eventType) {
    const listeners = cacheRefreshListenersMap.get(cacheKey);
    if (listeners) {
        const detail = {
            eventType,
            serviceName: target.serviceName,
            serviceFnName: target.serviceFnName,
            params: targetParams
        };
        listeners.forEach((f) => f(detail));
    }
}


function invokeServiceFunction(service, serviceName, serviceFnName, targetParams) {
    const serviceFn = getFunction(service, serviceName, serviceFnName);
    const promise = serviceFn(...targetParams);
    return promise;
}


function registerCacheRefreshListener(cacheRefreshListenersMap, cacheKey, cacheRefreshListener) {
    if (!cacheRefreshListenersMap.has(cacheKey)) {
        cacheRefreshListenersMap.set(cacheKey, new Map());
    }
    cacheRefreshListenersMap
        .get(cacheKey)
        .set(cacheRefreshListener.componentId, cacheRefreshListener.fn);
}


function performChecks(target, targetParams, options) {
    checkIsServiceBrokerTarget(target, 'target must have the correct properties');
    checkIsArray(targetParams, 'targetParams must be an array');
    checkIsServiceBrokerOptions(options, 'options must have the correct properties');
}


function loadData($injector,
                  cache,
                  cacheRefreshListenersMap,
                  target,
                  targetParams = [],
                  options) {

    const {serviceName, serviceFnName} = target;
    const {force = false, cacheRefreshListener} = options;

    const service = $injector.get(serviceName);
    const cacheKey = createKey(serviceName, serviceFnName, targetParams);

    // execute and cache data
    if (!cache.has(cacheKey) || force === true) {
        const promise = invokeServiceFunction(service, serviceName, serviceFnName, targetParams);
        cache.set(cacheKey, mkCacheValue(promise));

        notifyListeners(cacheKey, cacheRefreshListenersMap, target, targetParams, 'REFRESH');
    }

    // register cache refresh listener
    if (cacheRefreshListener) {
        registerCacheRefreshListener(cacheRefreshListenersMap, cacheKey, cacheRefreshListener);
    }

    // return data from cache
    const cacheValue = cache.get(cacheKey);
    const resultPromise = cacheValue.promise.then(data => ({
        lastRefreshed: cacheValue.lastRefreshed,
        data
    })).catch(error => {
        //evict the cache entry because it's in error
        cache.delete(cacheKey);
        throw error;
    });
    return resultPromise;
}


function service($injector) {
    const vm = initialiseData(this, initialState);


    const loadViewData = (target,
                          targetParams = [],
                          options = { force: false }) => {

        performChecks(target, targetParams, options);

        return loadData($injector,
                        vm.viewData,
                        vm.viewDataCacheRefreshListeners,
                        target,
                        targetParams,
                        options);
    };

    const loadAppData = (target,
                         targetParams = [],
                         options = { force: false }) => {

        performChecks(target, targetParams, options);

        return loadData($injector,
                        vm.appData,
                        vm.appDataCacheRefreshListeners,
                        target,
                        targetParams,
                        options);
    };

    const execute = (target,
                     targetParams = [],
                     options = {}) => {

        performChecks(target, targetParams, options);

        const {serviceName, serviceFnName} = target;
        const service = $injector.get(serviceName);
        const serviceFn = getFunction(service, serviceName, serviceFnName);
        return serviceFn(...targetParams)
            .then(data => ({data}));
    };

    const resetViewData = () => {
        vm.viewData.clear();
        vm.viewDataCacheRefreshListeners.clear();
    };

    const resetAll = () => {
        resetViewData();
        vm.appData.clear();
    };


    return {
        execute,
        loadAppData,
        loadViewData,
        resetViewData,
        resetAll
    };
}


service.$inject = ['$injector'];


export default service;

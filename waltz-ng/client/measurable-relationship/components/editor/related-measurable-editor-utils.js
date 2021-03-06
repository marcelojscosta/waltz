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

const RELATES_TO = { code: 'RELATES_TO', label: 'Relates To' };
const IS_DEPRECATED_BY = { code: 'DEPRECATES', label: 'Is Deprecated By' };
const DEPRECATES = { code: 'DEPRECATES', label: 'Deprecates' };

export const availableRelationshipKinds = {
    'MEASURABLE-MEASURABLE': [RELATES_TO],
    'MEASURABLE-CHANGE_INITIATIVE': [RELATES_TO, IS_DEPRECATED_BY],
    'CHANGE_INITIATIVE-MEASURABLE': [RELATES_TO, DEPRECATES],
    'CHANGE_INITIATIVE-CHANGE_INITIATIVE': [RELATES_TO]
};

/*
 * Waltz - Enterprise Architecture
 * Copyright (C) 2016  Khartec Ltd.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.khartec.waltz.data.measurable;


import com.khartec.waltz.data.entity_hierarchy.AbstractIdSelectorFactory;
import com.khartec.waltz.model.EntityKind;
import com.khartec.waltz.model.IdSelectionOptions;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.jooq.Select;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static java.lang.String.format;

@Service
public class MeasurableIdSelectorFactory extends AbstractIdSelectorFactory {

    @Autowired
    public MeasurableIdSelectorFactory(DSLContext dsl) {
        super(dsl, EntityKind.MEASURABLE);
    }


    @Override
    protected Select<Record1<Long>> mkForOptions(IdSelectionOptions options) {
        throw new UnsupportedOperationException(format(
                "Cannot create measurable selector from kind: %s",
                options.entityReference().kind()));
    }
}

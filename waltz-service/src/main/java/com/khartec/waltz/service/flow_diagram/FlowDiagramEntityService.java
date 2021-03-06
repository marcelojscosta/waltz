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

package com.khartec.waltz.service.flow_diagram;

import com.khartec.waltz.data.flow_diagram.FlowDiagramEntityDao;
import com.khartec.waltz.data.flow_diagram.FlowDiagramIdSelectorFactory;
import com.khartec.waltz.model.EntityReference;
import com.khartec.waltz.model.IdSelectionOptions;
import com.khartec.waltz.model.flow_diagram.FlowDiagramEntity;
import org.jooq.Record1;
import org.jooq.Select;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.khartec.waltz.common.Checks.checkNotNull;


@Service
public class FlowDiagramEntityService {

    private final FlowDiagramEntityDao flowDiagramEntityDao;
    private final FlowDiagramIdSelectorFactory flowDiagramIdSelectorFactory;


    @Autowired
    public FlowDiagramEntityService(FlowDiagramEntityDao flowDiagramEntityDao,
                                    FlowDiagramIdSelectorFactory flowDiagramIdSelectorFactory) {
        checkNotNull(flowDiagramEntityDao, "flowDiagramEntityDao cannot be null");
        checkNotNull(flowDiagramIdSelectorFactory, "flowDiagramIdSelectorFactory cannot be null");

        this.flowDiagramEntityDao = flowDiagramEntityDao;
        this.flowDiagramIdSelectorFactory = flowDiagramIdSelectorFactory;
    }


    public List<FlowDiagramEntity> findByDiagramId(long diagramId) {
        return flowDiagramEntityDao.findForDiagram(diagramId);
    }


    public List<FlowDiagramEntity> findByEntityReference(EntityReference ref) {
        checkNotNull(ref, "ref cannot be null");
        return flowDiagramEntityDao.findForEntity(ref);
    }


    public List<FlowDiagramEntity> findForSelector(IdSelectionOptions options) {
        checkNotNull(options, "options cannot be null");
        Select<Record1<Long>> selector = flowDiagramIdSelectorFactory.apply(options);
        return flowDiagramEntityDao.findForSelector(selector);
    }

}

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

package com.khartec.waltz.model.server_information;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.khartec.waltz.model.SummaryStatistics;
import com.khartec.waltz.model.tally.Tally;
import org.immutables.value.Value;

import java.util.List;

@Value.Immutable
@JsonSerialize(as=ImmutableServerSummaryStatistics.class)
@JsonDeserialize(as=ImmutableServerSummaryStatistics.class)
public abstract class ServerSummaryStatistics implements SummaryStatistics {

    public abstract long virtualCount();
    public abstract long physicalCount();
    public abstract List<Tally<String>> environmentCounts();
    public abstract List<Tally<String>> operatingSystemCounts();
    public abstract List<Tally<String>> locationCounts();
    public abstract List<Tally<String>> operatingSystemEndOfLifeStatusCounts();
    public abstract List<Tally<String>> hardwareEndOfLifeStatusCounts();

    @Value.Default
    public long totalCount() {
        return virtualCount() + physicalCount();
    }
}

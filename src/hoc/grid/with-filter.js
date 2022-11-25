import { filterBy } from '@progress/kendo-data-query';
import React from 'react';

export const withGridFilter = (GridComponent) => (props) => {
    const initialFilter = {
        logic: 'and',
        filters: [],
    };
    const [filter, setFilter] = React.useState(initialFilter);

    return (
        <GridComponent
            filterable={true}
            filter={filter}
            onFilterChange={(e) => setFilter(e.filter)}
            {...props}
            data={filterBy(props.data, filter)}
        />
    );
};

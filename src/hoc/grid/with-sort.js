import { orderBy } from '@progress/kendo-data-query';
import React from 'react';

export const withGridSort = (GridComponent) => (props) => {
    const initialSort = [{}];

    const [sort, setSort] = React.useState(initialSort);

    return (
        <GridComponent
            sortable={true}
            sort={sort}
            onSortChange={(e) => {
                setSort(e.sort);
            }}
            {...props}
            data={orderBy(props.data, sort)}
        />
    );
};

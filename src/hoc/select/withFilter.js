import React, { useState, useEffect } from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { filterBy } from '@progress/kendo-data-query';

export const withFilter =
    (WrappedComponent) =>
    ({ delay = 300, minLen = 0, allData = [], ...props }) => {
        const timeout = React.useRef(false);

        const [state, setState] = useState({
            data: [],
            loading: false,
        });

        const filterData = (filter) => {
            const fData = allData.slice();
            return filterBy(fData, filter);
        };

        const filterChange = (event) => {
            clearTimeout(timeout.current);

            if (event.filter.value.length < minLen) {
                setState({
                    data: allData.slice(),
                });
                return;
            }

            timeout.current = setTimeout(() => {
                setState({
                    loading: false,
                    data: filterData(event.filter),
                });
            }, delay);

            setState({ ...state, loading: true });
        };

        useEffect(() => {
            setState({ ...state, data: allData.slice() });
        }, [allData]);

        return (
            <>
                <WrappedComponent
                    data={state.data}
                    onFilterChange={filterChange}
                    filterable={true}
                    textField='text'
                    valueField='id'
                    loading={state.loading}
                    {...props}
                ></WrappedComponent>
            </>
        );
    };

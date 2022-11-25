import React, { useState, useEffect } from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { filterBy } from '@progress/kendo-data-query';

const isPresent = (value) => value !== null && value !== undefined;

export default function withValueField(DropDownComponent) {
    return class extends React.Component {
        component;

        get value() {
            if (this.component) {
                const value = this.component.value;
                return isPresent(value) ? value[this.props.valueField] : value;
            }
        }

        events = {
            onBlur: (event) => this.triggerEvent('onBlur', event),
            onFocus: (event) => this.triggerEvent('onFocus', event),
            onChange: (event) => this.triggerEvent('onChange', event),
            onPageChange: (event) => this.triggerEvent('onPageChange', event),
            onFilterChange: (event) => this.triggerEvent('onFilterChange', event),
        };

        triggerEvent(eventType, event) {
            if (this.props[eventType]) {
                this.props[eventType].call(undefined, {
                    ...event,
                    value: this.value,
                    target: this,
                });
            }
        }

        itemFromValue(value) {
            const { data = [], valueField } = this.props;
            return isPresent(value) ? data.find((item) => item[valueField] === value) : value;
        }

        render() {
            return (
                <DropDownComponent
                    {...this.props}
                    value={this.itemFromValue(this.props.value)}
                    defaultValue={this.itemFromValue(this.props.defaultValue)}
                    ref={(component) => (this.component = component)}
                    size='small'
                    {...this.events}
                />
            );
        }
    };
}

const withFilter =
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

/**
 * 下面 textField 和 valueField 一定要輸入
 * @param textField
 * @param valueField
 * @param data
 */
export const DLvalue = withValueField(DropDownList);

/**
 * 有過濾功能的下拉選單
 * @param textField  text
 * @param valueField id
 */
export const DDLWithFilter = withFilter(withValueField(DropDownList));

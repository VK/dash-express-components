import {equals, isNil} from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Abstraction for the memory storage_type to work the same way as local/session
 *
 * Each memory RequestStore component gets its own MemStore.
 */
class MemStore {
    constructor() {
        this._data = {};
        this._modified = -1;
    }

    getItem(key) {
        return this._data[key];
    }

    setItem(key, value) {
        this._data[key] = value;
        this.setModified(key);
    }

    removeItem(key) {
        delete this._data[key];
        this.setModified(key);
    }

    setModified(_) {
        this._modified = Date.now();
    }

    getModified(_) {
        return this._modified;
    }
}

/**
 * Abstraction for local/session storage_type.
 *
 * Single instances for localStorage, sessionStorage
 */
class WebStore {
    constructor(storage) {
        this._storage = storage;
    }

    getItem(key) {
        try {
            return JSON.parse(this._storage.getItem(key));
        } catch (e) {
            // in case we somehow got a non-JSON value in storage,
            // just ignore it.
            return null;
        }
    }

    setItem(key, value) {
        this._storage.setItem(key, JSON.stringify(value));
        this.setModified(key);
    }

    removeItem(key) {
        this._storage.removeItem(key);
        this._storage.removeItem(`${key}-timestamp`);
    }

    setModified(key) {
        this._storage.setItem(`${key}-timestamp`, Date.now());
    }

    getModified(key) {
        return (
            Number.parseInt(this._storage.getItem(`${key}-timestamp`), 10) || -1
        );
    }
}

/**
 * Easily keep data on the client side with this component.
 * The data is not inserted in the DOM.
 * Data can be in memory, localStorage or sessionStorage.
 * The data will be kept with the id as key.
 * The data will be collected from the url with additional info from the config
 * We use a longCallback feature, if set
 */
export default class RequestStore extends React.Component {
    constructor(props) {
        super(props);

        if (props.storage_type === 'local') {
            this._backstore = new WebStore(window.localStorage);
        } else if (props.storage_type === 'session') {
            this._backstore = new WebStore(window.sessionStorage);
        } else if (props.storage_type === 'memory') {
            this._backstore = new MemStore();
        }

        this.onStorageChange = this.onStorageChange.bind(this);
    }

    async fetchData(url, config) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.props.longCallback && {'X-Longcallback': 'true'}),
                },
                body: JSON.stringify(config),
            });

            if (response.status === 202) {
                setTimeout(() => {
                    this.fetchData(url, config);
                }, 1000);
                return;
            }

            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }

            const result = await response.json();
            const {id, setProps} = this.props;
            this._backstore.setItem(id, result);
            setProps({
                data: result,
                modified_timestamp: this._backstore.getModified(id),
            });
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    onStorageChange(e) {
        const {id, setProps} = this.props;
        if (e.key === id && setProps && e.newValue !== e.oldValue) {
            setProps({
                data: JSON.parse(e.newValue),
                modified_timestamp: this._backstore.getModified(id),
            });
        }
    }

    UNSAFE_componentWillMount() {
        const {setProps, id, data, storage_type} = this.props;
        if (storage_type !== 'memory') {
            window.addEventListener('storage', this.onStorageChange);
        }

        const old = this._backstore.getItem(id);
        if (isNil(old) && !isNil(data)) {
            this._backstore.setItem(id, data);
            setProps({
                modified_timestamp: this._backstore.getModified(id),
            });
            return;
        }

        if (!equals(old, data)) {
            setProps({
                data: old,
                modified_timestamp: this._backstore.getModified(id),
            });
        }
    }

    componentDidMount() {
        const {url, config} = this.props;
        if (url && config) {
            this.fetchData(url, config);
        }
    }

    componentDidUpdate(prevProps) {
        const {data, id, clear_data, setProps, url, config} = this.props;
        if (clear_data) {
            this._backstore.removeItem(id);
            setProps({
                clear_data: false,
                data: null,
                modified_timestamp: this._backstore.getModified(id),
            });
            return;
        }
        const old = this._backstore.getItem(id);
        if (!equals(data, old)) {
            if (data === undefined) {
                setProps({data: old});
            } else {
                this._backstore.setItem(id, data);
                setProps({
                    modified_timestamp: this._backstore.getModified(id),
                });
            }
        }

        if (url !== prevProps.url || !equals(config, prevProps.config)) {
            if (url && config) {
                this.fetchData(url, config);
            }
        }
    }

    componentWillUnmount() {
        if (this.props.storage_type !== 'memory') {
            window.removeEventListener('storage', this.onStorageChange);
        }
    }

    render() {
        return null;
    }
}

RequestStore.defaultProps = {
    storage_type: 'memory',
    clear_data: false,
    modified_timestamp: -1,
    longCallback: false,
};

RequestStore.propTypes = {
    id: PropTypes.string.isRequired,
    storage_type: PropTypes.oneOf(['local', 'session', 'memory']),
    data: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
        PropTypes.number,
        PropTypes.string,
        PropTypes.bool,
    ]),
    clear_data: PropTypes.bool,
    modified_timestamp: PropTypes.number,
    setProps: PropTypes.func,
    url: PropTypes.string,
    config: PropTypes.object,
    longCallback: PropTypes.bool,
};
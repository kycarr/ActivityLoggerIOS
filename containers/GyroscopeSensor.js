import * as React from 'react'
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { gyroscope, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";

import { UPDATE_INTERVAL, round } from '../constants/index'
import { addLog } from '../constants/actions'

/**
 * Access the device gyroscope sensor to respond to changes in rotation in 3d space.
 */
class GyroscopeSensor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
        };
    }

    componentDidMount() {
        setUpdateIntervalForType(SensorTypes.gyroscope, UPDATE_INTERVAL);
        this._toggle();
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    update = (data) => {
        this.props.dispatch(addLog('gyroscope', data))
        this.setState({ data });
    }

    _toggle = () => {
        if (this._subscription) {
            this._unsubscribe();
        } else {
            this._subscribe();
        }
    };

    _subscribe = async () => {
        this._subscription = gyroscope.subscribe(data =>
            this.update(data)
        );
    };

    _unsubscribe = () => {
        this._subscription && this._subscription.unsubscribe();
        this._subscription = null;
    };

    render() {
        const data = this.state.data

        return (
            <Text>
                {data.timestamp} Gyroscope: x={round(data.x)} y={round(data.y)} z={round(data.z)}
            </Text>
        )
    }
}

const mapStateToProps = state => {
    return {
        data: state.logs['gyroscope']
    };
};

export default connect(mapStateToProps)(GyroscopeSensor);
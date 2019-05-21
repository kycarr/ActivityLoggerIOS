import * as React from 'react'
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { magnetometer, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";

import { UPDATE_INTERVAL, round } from '../constants/index'
import { addLog } from '../constants/actions'

/**
 * Access the device magnetometer sensor(s) to respond to measure the changes in the magnetic field.
 */
class MagnetometerSensor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
        };
    }

    componentDidMount() {
        setUpdateIntervalForType(SensorTypes.magnetometer, UPDATE_INTERVAL);
        this._toggle();
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    update = (data) => {
        this.props.dispatch(addLog('magnetometer', data))
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
        this._subscription = magnetometer.subscribe(data =>
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
                {data.timestamp} Magnetometer: x={round(data.x)} y={round(data.y)} z={round(data.z)}
            </Text>
        )
    }
}

const mapStateToProps = state => {
    return {
        data: state.logs['magnetometer']
    };
};

export default connect(mapStateToProps)(MagnetometerSensor);
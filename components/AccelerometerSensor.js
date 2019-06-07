import React from 'react'
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";

import { UPDATE_INTERVAL, round, formatDate } from '../constants/index'
import { writeLog } from '../storage/files'

/**
 * Access the device accelerometer sensor(s) to respond to changes in acceleration in 3d space.
 */
class AccelerometerSensor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
        };
    }

    componentDidMount() {
        setUpdateIntervalForType(SensorTypes.accelerometer, UPDATE_INTERVAL);
        this._toggle();
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    update = (data) => {
        const formattedData = {
            "time": formatDate(new Date()),
            "x": data.x,
            "y": data.y,
            "z": data.z,
        }
        writeLog(this.props.user, this.props.activity, this.props.session, 'accelerometer', formattedData)
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
        this._subscription = accelerometer.subscribe(data =>
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
            <View>
                <Text style={{fontWeight: 'bold'}}>Accelerometer:</Text>
                <Text>x={round(data.x)} y={round(data.y)} z={round(data.z)}</Text>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        activity: state.activity,
        session: state.start_time,
    };
};

export default connect(mapStateToProps)(AccelerometerSensor);
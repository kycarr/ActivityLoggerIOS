import * as React from 'react'
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { gyroscope, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";

import { UPDATE_INTERVAL, round, formatDate } from '../constants/index'
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
        const formattedData = {
            "time": formatDate(new Date()),
            "x": data.x,
            "y": data.y,
            "z": data.z,
        }
        this.props.dispatch(addLog('gyroscope', formattedData))
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
            <View>
                <Text style={{fontWeight: 'bold'}}>Gyroscope:</Text>
                <Text>x={round(data.x)} y={round(data.y)} z={round(data.z)}</Text>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        data: state.logs['gyroscope']
    };
};

export default connect(mapStateToProps)(GyroscopeSensor);
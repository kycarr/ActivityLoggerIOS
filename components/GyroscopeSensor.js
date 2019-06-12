import * as React from 'react'
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { gyroscope, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";

import { UPDATE_INTERVAL, round, formatDate } from '../constants/index'
import { writeLog } from '../storage/files'

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
        writeLog(this.props.user, this.props.activity, this.props.session, 'gyroscope', `time,x,y,z`)
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    update = (data) => {
        const formattedData = `"${formatDate(new Date())}",${data.x},${data.y},${data.z}`
        writeLog(this.props.user, this.props.activity, this.props.session, 'gyroscope', formattedData)
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
        user: state.user,
        activity: state.activity,
        session: state.start_time,
    };
};

export default connect(mapStateToProps)(GyroscopeSensor);
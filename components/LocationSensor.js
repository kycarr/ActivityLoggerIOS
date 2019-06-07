import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import RNLocation from 'react-native-location';

import { LOCATION_INTERVAL, formatDate } from '../constants/index'
import { writeLog } from '../storage/files'

class LocationSensor extends Component {
    state = {
        isAvailable: false,
        data: null,
    };

    componentWillMount() {
        RNLocation.configure({
            desiredAccuracy: {
                ios: "best",
                android: "balancedPowerAccuracy"
            },
            // Android only
            androidProvider: "auto",
            interval: LOCATION_INTERVAL,
            fastestInterval: LOCATION_INTERVAL,
            maxWaitTime: LOCATION_INTERVAL,
            // iOS Only
            activityType: "other",
            allowsBackgroundLocationUpdates: true,
            showsBackgroundLocationIndicator: true,
        })

        this._subscribe();
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    update = (data) => {
        writeLog(this.props.user, this.props.activity, this.props.session, 'location', `time: ${formatDate(new Date())}`)
        writeLog(this.props.user, this.props.activity, this.props.session, 'location', `longitude: ${data.longitude}`)
        writeLog(this.props.user, this.props.activity, this.props.session, 'location', `latitude: ${data.latitude}`)
        writeLog(this.props.user, this.props.activity, this.props.session, 'location', `accuracy: ${data.accuracy}`)
        writeLog(this.props.user, this.props.activity, this.props.session, 'location', `altitude: ${data.altitude}`)
        writeLog(this.props.user, this.props.activity, this.props.session, 'location', `altitudeAccuracy: ${data.altitudeAccuracy}`)
        writeLog(this.props.user, this.props.activity, this.props.session, 'location', `speed: ${data.speed}`)
        writeLog(this.props.user, this.props.activity, this.props.session, 'location', `course: ${data.course}`)
        writeLog(this.props.user, this.props.activity, this.props.session, 'location', '')
        this.setState({ data });
    }

    _subscribe = async () => {
        RNLocation.requestPermission({
            ios: "always",
            android: {
                detail: "coarse"
            }
        }).then(granted => {
            this.setState({ isAvailable: granted });
            if (granted) {
                this._subscription = RNLocation.subscribeToLocationUpdates(locations => {
                    this.update(locations[0])
                })
            }
        })
    };

    _unsubscribe = () => {
        this._subscription()
    };

    render() {
        if (!this.state.isAvailable) {
            return (
                <Text>GPS not available</Text>
            )
        }

        return (
            <View>
                <Text style={{fontWeight: 'bold'}}>Location:</Text>
                <Text>{JSON.stringify(this.state.data)}</Text>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        activity: state.activity,
        session: state.start_time,
    };
};

export default connect(mapStateToProps)(LocationSensor);
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import RNLocation from 'react-native-location';

import { LOCATION_INTERVAL, formatDate } from '../constants/index'
import { addLog } from '../constants/actions'

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
        const formattedData = {
            "time": formatDate(new Date()),
            "longitude": data.longitude,
            "latitude": data.latitude,
            "accuracy": data.accuracy,
            "altitude": data.altitude,
            "altitudeAccuracy": data.altitudeAccuracy,
            "speed": data.speed,
            "course": data.course,
        }
        this.props.dispatch(addLog('location', formattedData))
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
        data: state.logs['location']
    };
};

export default connect(mapStateToProps)(LocationSensor);
import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import RNLocation from 'react-native-location';

import { LOCATION_INTERVAL, LOCATION_DISTANCE } from '../constants/index'
import { addLog } from '../constants/actions'

class LocationSensor extends Component {
    state = {
        isAvailable: false,
        data: null,
    };

    componentWillMount() {
        RNLocation.configure({
            distanceFilter: LOCATION_DISTANCE,
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
            pausesLocationUpdatesAutomatically: false,
            showsBackgroundLocationIndicator: false,
        })

        this._subscribe();
    }

    componentWillUnmount() {
        this._unsubscribe();
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
                    for (location in locations) {
                        this.props.dispatch(addLog('location', location))
                    }
                    this.setState({ data: locations[0] });
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
            <Text>
                Location: {JSON.stringify(this.state.data)}
            </Text>
        );
    }
}

const mapStateToProps = state => {
    return {
        data: state.logs['location']
    };
};

export default connect(mapStateToProps)(LocationSensor);
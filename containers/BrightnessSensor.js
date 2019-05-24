import * as React from 'react'
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import DeviceBrightness from 'react-native-device-brightness';

import { BRIGHTNESS_INTERVAL, formatDate } from '../constants/index'
import { addLog } from '../constants/actions'

/**
 * 
 */
class BrightnessSensor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: 0,
        };
    }

    componentDidMount() {
        this._subscribe();
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    update = (data) => {
        const formattedData = {
            "time": formatDate(new Date()),
            "brightness": data,
        }
        this.props.dispatch(addLog('brightness', formattedData))
        this.setState({ data });
    }

    _subscribe = async () => {
        this.subscription = setInterval(this.getBrightness, BRIGHTNESS_INTERVAL);
    };

    _unsubscribe = () => {
        clearInterval(this.subscription)
    };

    getBrightness = async () => {
        let brightness = await DeviceBrightness.getBrightnessLevel()
        this.update(brightness)
    }

    render() {
        return (
            <View>
                <Text style={{fontWeight: 'bold'}}>Brightness:</Text>
                <Text>{this.state.data}</Text>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        data: state.logs['brightness']
    };
};

export default connect(mapStateToProps)(BrightnessSensor);
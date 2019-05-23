import * as React from 'react';
import { Picker, ScrollView, StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-elements'
import { Appbar, Button, Dialog, Divider, TextInput } from 'react-native-paper';
import { connect } from 'react-redux';

import {
    setUser,
    setActivity,
    start,
    end,
    getUsers,
    getActivities,
    clearUsers,
    clearActivities
} from '../constants/actions'

import AccelerometerSensor from './AccelerometerSensor'
import BrightnessSensor from './BrightnessSensor'
import GyroscopeSensor from './GyroscopeSensor'
import LocationSensor from './LocationSensor'
import MagnetometerSensor from './MagnetometerSensor'

class MainApplication extends React.Component {
    state = {
        activityType: 'other',
        elapsedTime: '00:00:00',
        isUserLocked: false,
        isActivityLocked: false,
        isDialogVisible: false,
    };

    componentDidMount() {
        console.disableYellowBox = true;
        this.props.dispatch(getUsers())
        this.props.dispatch(getActivities())
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }



    onClear = () => {
        this.props.dispatch(clearUsers())
        this.props.dispatch(clearActivities())
    }

    onUserNameSet = (name) => {
        this.props.dispatch(setUser(name))
    }

    onActivityChosen = (type) => {
        const name = type === 'other' ? '' : type
        this.setState({ activityType: type })
        this.onActivityNameSet(name)
    }

    onActivityNameSet = (name) => {
        this.props.dispatch(setActivity(name))
    }

    onToggleTimer = (confirmStop) => {
        // timer hasn't started, start it
        if (!this.props.didStart) {
            this.props.dispatch(start(this.props.userID, this.props.activityName))
            this.timer = setInterval(() => {
                this.setState({ elapsedTime: this.getTime() });
            }, 1000);
            this.setState({ elapsedTime: '00:00:00' })
        }
        // timer is being stopped
        else {
            if (confirmStop) {
                this.props.dispatch(end())
                clearInterval(this.timer);
                this.setState({ isDialogVisible: false })
            } else {
                this.setState({ isDialogVisible: true })
            }
        }
    }



    getTime = () => {
        if (this.props.startTime === '') {
            return '00:00:00'
        }
        else if (this.props.endTime === '') {
            const start = new Date(this.props.startTime)
            const diff = new Date() - start
            return this.msToTime(diff)
        }
        else {
            const start = new Date(this.props.startTime)
            const end = new Date(this.props.endTime)
            const diff = end - start
            return this.msToTime(diff)
        }
    };

    msToTime = (s) => {
        var pad = (n, z = 2) => ('00' + n).slice(-z);
        return pad(s / 3.6e6 | 0) + ':' + pad((s % 3.6e6) / 6e4 | 0) + ':' + pad((s % 6e4) / 1000 | 0)
    }



    userID() {
        return (
            <View style={styles.container}>
                <View style={styles.row}>
                    <TextInput
                        style={{ flex: 1 }}
                        label='User ID'
                        value={this.props.userID}
                        disabled={this.state.isUserLocked || this.props.didStart}
                        onChangeText={text => this.onUserNameSet(text)}
                    />
                    <Icon
                        reverse
                        color='#f50'
                        type='font-awesome'
                        name={this.state.isUserLocked || this.props.didStart ? 'lock' : 'unlock'}
                        onPress={() => this.setState({ isUserLocked: !this.state.isUserLocked })} />
                </View>

                {this.props.didStart || this.state.isUserLocked ? undefined :
                    <Picker
                        selectedValue={this.props.userID}
                        onValueChange={(itemValue, itemIndex) => this.onUserNameSet(itemValue)} >
                        <Picker.Item label="" value="" />
                        {this.props.users.map((item, i) =>
                            <Picker.Item label={item} value={item} key={i} />
                        )}
                    </Picker>
                }
            </View>
        )
    }

    activity() {
        return (
            <View style={styles.container}>
                <View style={styles.row}>
                    <TextInput
                        style={{ flex: 1 }}
                        label='Activity'
                        value={this.props.activityName}
                        disabled={this.state.activityType !== 'other' || this.state.isActivityLocked || this.props.didStart}
                        onChangeText={text => this.onActivityNameSet(text)}
                    />
                    <Icon
                        reverse
                        color='#f50'
                        type='font-awesome'
                        name={this.state.isActivityLocked || this.props.didStart ? 'lock' : 'unlock'}
                        onPress={() => this.setState({ isActivityLocked: !this.state.isActivityLocked })} />
                </View>

                {this.props.didStart || this.state.isActivityLocked ? undefined :
                    <Picker
                        selectedValue={this.state.activityType}
                        onValueChange={(itemValue, itemIndex) => this.onActivityChosen(itemValue)} >
                        <Picker.Item label="other" value="other" />
                        {this.props.activities.map((item, i) =>
                            <Picker.Item label={item} value={item} key={i}/>
                        )}
                    </Picker>
                }
            </View>
        )
    }

    logger() {
        return (
            <View style={styles.container}>
                <Text>Start Time: {this.props.startTime}</Text>
                <Text>End Time: {this.props.endTime}</Text>
                <Text h4>{this.state.elapsedTime}</Text>
                <Button
                    mode="contained"
                    disabled={this.props.userID === '' || this.props.activityName === ''}
                    onPress={() => this.onToggleTimer(false)}>
                    {this.props.didStart ? 'STOP' : 'START'}
                </Button>
            </View>
        )
    }

    sensors() {
        if (!this.props.didStart) {
            return <View />
        }

        return (
            <View style={styles.container}>
                <AccelerometerSensor />
                <BrightnessSensor />
                <LocationSensor />
                <GyroscopeSensor />
                <MagnetometerSensor />
            </View>
        )
    }

    render() {
        return (
            <View>
                <Appbar.Header>
                    <Appbar.Content title="Activity Logger" />
                    <Appbar.Action icon="delete" onPress={() => this.onClear()} />
                </Appbar.Header>

                <ScrollView>
                    {this.userID()}
                    <Divider />
                    {this.activity()}
                    <Divider />
                    {this.logger()}
                    <Divider />
                    {this.sensors()}
                </ScrollView>

                <Dialog
                    visible={this.state.isDialogVisible}
                    onDismiss={() => this.setState({ isDialogVisible: false })}>
                    <Dialog.Title>Alert</Dialog.Title>
                    <Dialog.Content>
                        <Text>Stop logging data?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => this.onToggleTimer(true)}>Done</Button>
                    </Dialog.Actions>
                </Dialog>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    row: {
        flexDirection: 'row',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const mapStateToProps = state => {
    return {
        userID: state.user,
        activityName: state.activity,
        startTime: state.startTime,
        endTime: state.endTime,
        activities: state.activities,
        users: state.users,
        didStart: state.isRecording,
        log: state.logs,
    };
};

export default connect(mapStateToProps)(MainApplication);
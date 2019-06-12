import React from 'react'
import { Picker, ScrollView, StyleSheet, View } from 'react-native'
import { Icon, Text } from 'react-native-elements'
import { Appbar, Button, Dialog, TextInput } from 'react-native-paper';
import { connect } from 'react-redux'

import { startRecording, stopRecording } from '../redux/actions'
import { loadUsers, loadActivities, clearUsers, clearActivities } from '../storage/storage'

import Sensors from './Sensors'

class MainApplication extends React.Component {
    state = {
        user: '',
        activity: '',
        activityType: 'other',
        elapsedTime: '00:00:00',

        isRecording: false,
        isUserLocked: false,
        isActivityLocked: false,
        isDialogVisible: false,

        users: [],
        activities: [],
    };

    componentDidMount() {
        // console.disableYellowBox = true;
        this.load()
    }

    load = async () => {
        this.setState({ users: await loadUsers(), activities: await loadActivities() })
    }

    clear = async () => {
        clearUsers()
        clearActivities()
        this.load()
    }

    onActivityChosen = (type) => {
        const name = type === 'other' ? '' : type
        this.setState({ activityType: type, activity: name })
    }

    onToggleTimer = (confirmStop) => {
        // start the timer
        if (!this.state.isRecording) {
            this.props.dispatch(startRecording(this.state.user, this.state.activity))
            this.timer = setInterval(() => { this.setState({ elapsedTime: this.getTime() }); }, 500);
            this.setState({ elapsedTime: '00:00:00', isRecording: true })
        }
        // stop the timer
        else {
            if (confirmStop) {
                this.props.dispatch(stopRecording())
                clearInterval(this.timer);
                this.setState({ isDialogVisible: false, isRecording: false })
            }
            else {
                this.setState({ isDialogVisible: true })
            }
            this.load()
        }
    }

    getTime = () => {
        if (this.props.endTime === '') {
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
                        value={this.state.user}
                        disabled={this.state.isUserLocked || this.state.isRecording}
                        onChangeText={text => this.setState({ user: text })}
                    />
                    <Icon
                        reverse
                        color='#f50'
                        type='font-awesome'
                        name={this.state.isUserLocked || this.state.isRecording ? 'lock' : 'unlock'}
                        onPress={() => this.setState({ isUserLocked: !this.state.isUserLocked })} />
                </View>

                {this.state.isRecording || this.state.isUserLocked ? undefined :
                    <Picker
                        selectedValue={this.state.user}
                        onValueChange={(itemValue, itemIndex) => this.setState({ user: itemValue })} >
                        <Picker.Item label="" value="" />
                        {this.state.users.map((item, i) =>
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
                        value={this.state.activity}
                        disabled={this.state.activityType !== 'other' || this.state.isActivityLocked || this.state.isRecording}
                        onChangeText={text => this.setState({ activity: text })}
                    />
                    <Icon
                        reverse
                        color='#f50'
                        type='font-awesome'
                        name={this.state.isActivityLocked || this.state.isRecording ? 'lock' : 'unlock'}
                        onPress={() => this.setState({ isActivityLocked: !this.state.isActivityLocked })} />
                </View>

                {this.state.isRecording || this.state.isActivityLocked ? undefined :
                    <Picker
                        selectedValue={this.state.activityType}
                        onValueChange={(itemValue, itemIndex) => this.onActivityChosen(itemValue)} >
                        <Picker.Item label="other" value="other" />
                        {this.state.activities.map((item, i) =>
                            <Picker.Item label={item} value={item} key={i} />
                        )}
                    </Picker>
                }
            </View>
        )
    }

    logger() {
        return (
            <View style={styles.container}>
                {this.state.isRecording ?
                    <View>
                        <Text>Start Time: {this.props.startTime}</Text>
                        <Text>End Time: {this.props.endTime}</Text>
                        <Text h4>{this.state.elapsedTime}</Text>
                    </View>
                    : undefined
                }
                <Button
                    mode="contained"
                    disabled={this.state.user === '' || this.state.activity === ''}
                    onPress={() => this.onToggleTimer(false)}>
                    {this.state.isRecording ? 'STOP RECORDING' : 'START RECORDING'}
                </Button>
            </View>
        )
    }

    render() {
        return (
            <View>
                <Appbar.Header>
                    <Appbar.Content title="Activity Logger" />
                    <Appbar.Action icon="delete" onPress={() => this.clear()} />
                </Appbar.Header>

                <ScrollView>
                    {this.userID()}
                    {this.activity()}
                    {this.logger()}
                    <Sensors isRecording={this.state.isRecording} />
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

const mapStateToProps = (state) => {
    return {
        startTime: state.start_time,
        endTime: state.end_time,
    }
}

export default connect(mapStateToProps)(MainApplication);
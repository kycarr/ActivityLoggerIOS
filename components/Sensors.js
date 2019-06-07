import React from 'react';
import { StyleSheet, View } from 'react-native';
import Video from 'react-native-video';

import AccelerometerSensor from './AccelerometerSensor'
import BrightnessSensor from './BrightnessSensor'
import GyroscopeSensor from './GyroscopeSensor'
import LocationSensor from './LocationSensor'
import MagnetometerSensor from './MagnetometerSensor'

const Sensors = ({ isRecording }) => {
  if (!isRecording) {
    return <View />
  }

  return (
    <View style={styles.container}>
      <AccelerometerSensor />
      <BrightnessSensor />
      <LocationSensor />
      <GyroscopeSensor />
      <MagnetometerSensor />

      <Video
        source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
        ref={(ref) => {
          this._player = ref
        }}
        rate={1.0}                              // 0 is paused, 1 is normal.
        volume={0.01}                           // 0 is muted, 1 is normal.
        muted={false}                           // Mutes the audio entirely.
        paused={false}                          // Pauses playback entirely.
        repeat={true}                           // Repeat forever.
        playInBackground={true}                 // Audio continues to play when app entering background.
        playWhenInactive={true}                 // [iOS] Video continues to play when control or notification center are shown.
        ignoreSilentSwitch={"ignore"}           // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual.
        progressUpdateInterval={250.0}          // [iOS] Interval to fire onProgress (default to ~250ms)
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
});

export default Sensors
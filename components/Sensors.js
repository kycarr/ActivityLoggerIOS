import React from 'react';
import { StyleSheet, View } from 'react-native';

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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  }
});

export default Sensors
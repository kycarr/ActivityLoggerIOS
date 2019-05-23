import FileSystem from 'react-native-filesystem';
import { Linking } from 'react-native';

export const APP_DIRECTORY = 'activity-logger'
export const SUPPORT_EMAIL = 'kcarr@ict.usc.edu'
export const SUPPORT_SUBJECT = 'Activity Log File'

export const writeLog = async (id, activity, session, content) => {
    const fileName = `${id}-${activity}-${session}.txt`
    const path = `${APP_DIRECTORY}/${id}/${activity}/${session}/${fileName}`
    await FileSystem.writeToFile(path, content);
}

export const loadLog = async (id, activity, session) => {
    const fileName = `${id}-${activity}-${session}.txt`
    const path = `${APP_DIRECTORY}/${id}/${activity}/${session}/${fileName}`
    const fileContents = await FileSystem.readFile(path);
    return fileContents
}

export const emailLog = async (id, activity, session) => {
    const content = await loadLog(id, activity, session)
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${SUPPORT_SUBJECT}&body=${content}`)
}
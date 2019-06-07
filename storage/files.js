import FileSystem from 'react-native-filesystem-v1';
import { Linking } from 'react-native';

export const APP_DIRECTORY = 'activity-logger'
export const SUPPORT_EMAIL = 'activityloggerict@gmail.com'
export const SUPPORT_SUBJECT = 'Activity Log File'

export const writeLog = async (id, activity, session, log_type, content) => {
    id = id.replace(/\//g, '')
    activity = activity.replace(/\//g, '')
    session = session.replace(/\//g, '.')

    const fileName = `${log_type}.txt`
    const path = `${APP_DIRECTORY}/${id}/${activity}/${session}/${fileName}`
    content = `${content}\n`

    await FileSystem.writeToFile(path, content, true);
}

export const loadLog = async (id, activity, session, log_type) => {
    id = id.replace(/\//g, '')
    activity = activity.replace(/\//g, '')
    session = session.replace(/\//g, '.')

    const fileName = `${log_type}.txt`
    const path = `${APP_DIRECTORY}/${id}/${activity}/${session}/${fileName}`
    const fileContents = await FileSystem.readFile(path);

    return fileContents
}

export const emailLog = async (id, activity, session) => {
    id = id.replace(/\//g, '')
    activity = activity.replace(/\//g, '')
    session = session.replace(/\//g, '.')

    const subject = `${SUPPORT_SUBJECT}: ${id} ${activity} ${session}`
    const log = await loadLog(id, activity, session, 'log')

    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${log}`)
}
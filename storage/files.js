import FileSystem from 'react-native-filesystem-v1';
import { Linking } from 'react-native';

export const APP_DIRECTORY = 'activity-logger'
export const SUPPORT_EMAIL = 'kcarr@ict.usc.edu' //'maryvel@gmail.com'
export const SUPPORT_SUBJECT = 'Activity Log File'

export const writeLog = async (id, activity, session, log_type, content) => {
    const fileName = `${log_type}.txt`
    const path = `${APP_DIRECTORY}/${id}/${activity}/${session}/${fileName}`
    await FileSystem.writeToFile(path, content, true);
}

export const loadLog = async (id, activity, session, log_type) => {
    const fileName = `${log_type}.txt`
    const path = `${APP_DIRECTORY}/${id}/${activity}/${session}/${fileName}`
    const fileContents = await FileSystem.readFile(path);
    return fileContents
}

export const emailLogs = async (id, activity, session) => {

}

export const emailLog = async (id, activity, session) => {
    const content = await loadLog(id, activity, session)
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${SUPPORT_SUBJECT} (${id}, ${activity}, ${session})&body=${content}`)
}
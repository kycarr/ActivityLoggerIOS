import FileSystem from 'react-native-filesystem';

export const APP_DIRECTORY = 'activity-logger'

export const writeLog = async (id, activity, session, content) => {
    const path = `${APP_DIRECTORY}/${id}/${activity}/${session}/file.txt`
    await FileSystem.writeToFile(path, content);
}
export const loadLog = async (id, activity, session) => {
    const path = `${APP_DIRECTORY}/${id}/${activity}/${session}/file.txt`
    const fileContents = await FileSystem.readFile(path);
    return fileContents
}

export const APP_DIRECTORY = 'activity-logger'

export const writeLog = async (id, activity, session, content) => {
    const RNFS = require('react-native-fs');
    const path = `${RNFS.DocumentDirectoryPath}/${APP_DIRECTORY}/${id}/${activity}/${session}/file.txt`

    RNFS.writeFile(path, content, 'utf8')
        .then((success) => {
            console.log('FILE WRITTEN!');
            console.log(content);
        })
        .catch((err) => {
            console.log(err.message);
        });
}

export const loadLog = async (id, activity, session) => {
    const path = `${RNFS.DocumentDirectoryPath}/${APP_DIRECTORY}/${id}/${activity}/${session}/file.txt`
    return await RNFS.readFile(path, 'utf8')
}
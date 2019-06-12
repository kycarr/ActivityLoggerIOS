import FileSystem from 'react-native-filesystem-v1';
import MailCompose from 'react-native-mail-compose';

export const APP_DIRECTORY = 'activity-logger'
export const SUPPORT_EMAIL = 'activityloggerict@gmail.com'
export const SUPPORT_SUBJECT = 'Activity Log File'

export const writeLog = async (id, activity, session, log_type, content) => {
  id = id.replace(/\//g, '')
  activity = activity.replace(/\//g, '')
  session = session.replace(/\//g, '.')

  const fileName = `${log_type}.csv`
  const path = `${APP_DIRECTORY}/${id}/${activity}/${session}/${fileName}`
  content = `${content}\n`

  await FileSystem.writeToFile(path, content, true);
}

export const loadLog = async (id, activity, session, log_type) => {
  id = id.replace(/\//g, '')
  activity = activity.replace(/\//g, '')
  session = session.replace(/\//g, '.')

  const fileName = `${log_type}.csv`
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
  const accelerometer = await loadLog(id, activity, session, 'accelerometer')
  const gyroscope = await loadLog(id, activity, session, 'gyroscope')
  const magnetometer = await loadLog(id, activity, session, 'magnetometer')
  const location = await loadLog(id, activity, session, 'location')
  const brightness = await loadLog(id, activity, session, 'brightness')

  await MailCompose.send({
    toRecipients: [SUPPORT_EMAIL, 'kaylacar@usc.edu'],
    subject: subject,
    text: '',
    attachments: [
      {
        filename: 'log',
        ext: '.csv',
        mimeType: 'csv',
        text: log,
      },
      {
        filename: 'accelerometer',
        ext: '.csv',
        mimeType: 'csv',
        text: accelerometer,
      },
      {
        filename: 'gyroscope',
        ext: '.csv',
        mimeType: 'csv',
        text: gyroscope,
      },
      {
        filename: 'magnetometer',
        ext: '.csv',
        mimeType: 'csv',
        text: magnetometer,
      },
      {
        filename: 'location',
        ext: '.csv',
        mimeType: 'csv',
        text: location,
      },
      {
        filename: 'brightness',
        ext: '.csv',
        mimeType: 'csv',
        text: brightness,
      },
    ],
  });
}
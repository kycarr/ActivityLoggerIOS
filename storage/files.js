import FileSystem from 'react-native-filesystem-v1';
import Mailer from 'react-native-mail';

export const APP_DIRECTORY = 'activity-logger'
export const SUPPORT_EMAIL = 'kcarr@ict.usc.edu'
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
  const log = FileSystem.absolutePath(`${APP_DIRECTORY}/${id}/${activity}/${session}/log.csv`)

  Mailer.mail({
    subject: subject,
    recipients: [SUPPORT_EMAIL],
    isHTML: true,
    body: '',
    attachment: {
      path: log,
      type: 'csv',
      name: 'log.csv',
    }
  }, (error, event) => { });
}
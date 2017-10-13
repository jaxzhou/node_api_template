import morgan from 'morgan';
import rfs from 'rotating-file-stream';

morgan.token('user', (req) => req.user && `${req.user.account}/${req.user.name}`);
morgan.token('clientip', (req) => req.headers['x-forwarded-for'] || req.connection.remoteAddress);
const logFormat = ':clientip - :user :date ":method :url" :status :res[content-length] - :response-time[0]ms';

export default morgan(logFormat, {stream: rfs('api.log', {interval: '1d', path: './log'})});

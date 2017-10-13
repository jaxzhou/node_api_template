import cors from 'cors';

const allowedHeaders = [
  "Authorization",
  "withcredentials",
  "x-requested-with",
  "x-forwarded-for",
  "x-real-ip",
  "x-customheader",
  "user-agent",
  "keep-alive",
  "host",
  "accept",
  "connection",
  "upgrade",
  "content-type",
  "dnt",
  "if-modified-since",
  "cache-control"
];

export default cors({
  exposedHeaders: allowedHeaders
});

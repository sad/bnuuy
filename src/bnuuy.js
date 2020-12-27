const Twitter = require('twitter-lite');
const path = require('path');
const cron = require('cron');
const fs = require('fs');
const logger = require('./logger');

require('dotenv-safe').config();

const client = (subdomain = 'api') => {
  return new Twitter({
    subdomain,
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_SECRET,
    access_token_key: process.env.ACCESS,
    access_token_secret: process.env.ACCESS_SECRET,
  });
};

const mainClient = client();
const imgClient = client('upload');

const setTweeted = (filename) => {
  const name = filename.substring(filename.lastIndexOf('/') + 1, filename.length);
  const newPath = `${path.join(__dirname, '../pics-tweeted')}/${name}`;
  fs.rename(filename, newPath, (err) => {
    if (err) logger.error(`Could not move file: ${err}`);
    else logger.success(`Moved ${name} to pics-tweeted.`);
  });
};

const postImage = (imgPath, status = '') => {
  const img = fs.readFileSync(imgPath, { encoding: 'base64' });
  imgClient.post('media/upload', { media_data: img })
    .then((res) => {
      mainClient.post('statuses/update', {
        status,
        media_ids: `${res.media_id_string}`,
      }).catch((err) => {
        logger.error(err);
      }).then((pRes) => {
        const pathStr = imgPath.substring(imgPath.lastIndexOf('/') + 1, imgPath.length);
        logger.success(`Posted ${logger.chalk().bold(pathStr)} (${logger.chalk().bold(pRes.text)})`);
        setTweeted(imgPath);
      });
    })
    .catch(() => {
      logger.error('Could not upload media. Removing bugged media and retrying.');
      setTweeted(imgPath);
      return pickImage();
    });
};

const pickImage = (dir = path.join(__dirname, '../pics')) => {
  const files = fs.readdirSync(dir);
  const rand = files[Math.floor(Math.random() * files.length)];
  if (!rand) return logger.error('No pictures left to tweet.');
  return postImage(`${dir}/${rand}`);
};

const checkAuth = () => {
  mainClient.get('account/verify_credentials').then((res) => {
    if (!res.screen_name) return logger.error('Could not sign you in, please double check your credentials.');

    logger.success(`Logged in as ${res.name} (@${logger.chalk().bold(res.screen_name)}).`);
    logger.success(`${logger.chalk().bold(res.followers_count)} followers`);
  });
};

checkAuth();
// pickImage();

// every hour
const schedule = new cron.CronJob('0 * * * *', () => {
  logger.log('Attempting to post new Tweet');
  // pickImage();
});

schedule.start();

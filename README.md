# bnuuy
simple twitter bot using `twitter-lite` to tweet an image every hour.

### setup
first, complete these preliminary steps to obtain api keys for your twitter account of choice.

- [apply for a Twitter Developer account](https://developer.twitter.com/en/apply-for-access) using the account you are planning to run the bot on
- create an application through the [Develpoper Portal](https://developer.twitter.com/en/portal/dashboard)
- create authentication tokens for your twitter account
- obtain images that you'd like the bot to tweet

then you can clone this repository and set up the bot.

```sh
$ git clone https://github.com/sad/bnuuy
$ cd bnuuy
$ yarn
$ mkdir pics pics-tweeted
$ cp .env.example .env
```

after this, fill out the `.env` file with your tokens, and move any images you have to the `pics` folder.

if you wish to change the frequency at which the bot tweets images, please edit the cron expression at the bottom which reads `0 * * * *` by default. [this site](https://crontab.guru/examples.html) has examples of common crontab expressions.

you can stop the bot from moving tweeted images out of the `pics` folder by commenting out anywhere that `setTweeted()` is called.

once you're ready, you can run `node src/bnuuy.js` to start the bot. i recommend using [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/) to keep the bot running, and optionally start it when your system starts. after installing pm2 (`yarn global add pm2`), simply run the following command:

```sh
$ pm2 start ecosystem.config.js
```

this will start the bot and monitor for changes.  see [this page](https://pm2.keymetrics.io/docs/usage/startup/) for information on having pm2 start the process automatically on boot.

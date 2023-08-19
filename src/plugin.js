import videojs from 'video.js';
import { version as VERSION } from '../package.json';

const Plugin = videojs.getPlugin('plugin');
const Button = videojs.getComponent('Button');

const defaults = {
  replayIndex: 1,
};

class ReplayButton extends Button {
  constructor(player, options) {
    super(player, options);

    this.controlText('Replay');

    this.on(player, 'play', (e) => this.handlePlay(e));
    this.on(player, 'ended', (e) => this.handleEnded(e));
  }

  buildCSSClass() {
    return `vjs-replay-control ${super.buildCSSClass()}`;
  }

  handleClick(event) {
    this.player_.currentTime(0);
    this.player_.play();
  }

  handleSeeked(event) {
    this.removeClass('vjs-hidden');
  }

  handlePlay(event) {
    this.removeClass('vjs-hidden');
  }

  handleEnded(event) {
    this.addClass('vjs-hidden');

    this.one(this.player_, 'seeked', (e) => this.handleSeeked(e));
  }
}
videojs.registerComponent('ReplayButton', ReplayButton);

class ResumePlayback extends Plugin {
  constructor(player, options) {
    super(player);

    this.options = videojs.mergeOptions(defaults, options);

    const { videoId, replayIndex } = this.options;

    this.player.ready(() => {
      const key = `videojs-resume-playback:${videoId}`;

      this.player.on('timeupdate', () => {
        localStorage.setItem(key, this.player.currentTime());
      });

      this.player.on('ended', () => {
        localStorage.removeItem(key);
      });

      const lastTime = parseFloat(localStorage.getItem(key));
      if (lastTime) {
        this.player.currentTime(lastTime);
        this.player.play();
      }

      this.player.controlBar.addChild('ReplayButton', {}, replayIndex);
    });
  }
}

ResumePlayback.defaultState = {};

ResumePlayback.VERSION = VERSION;

videojs.registerPlugin('resumePlayback', ResumePlayback);

export default ResumePlayback;

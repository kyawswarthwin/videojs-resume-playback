import videojs from 'video.js';
import { version as VERSION } from '../package.json';

const Plugin = videojs.getPlugin('plugin');
const Button = videojs.getComponent('Button');

const defaults = {
  resumeable: true,
};

class ReplayButton extends Button {
  constructor(player, options) {
    super(player, options);
    this.controlText('Replay');
  }

  buildCSSClass() {
    return `vjs-replay-control ${super.buildCSSClass()}`;
  }

  handleClick(event) {
    this.player_.currentTime(0);
    this.player_.play();
  }
}
videojs.registerComponent('ReplayButton', ReplayButton);

class ResumePlayback extends Plugin {
  constructor(player, options) {
    super(player);

    this.options = videojs.mergeOptions(defaults, options);

    const { resumeable, videoId } = this.options;

    this.player.ready(() => {
      this.player.controlBar.addChild('ReplayButton', {}, 0);

      const key = `videojs-resume-playback:${videoId}`;

      this.player.on('timeupdate', () => {
        localStorage.setItem(key, this.player.currentTime());
      });

      this.player.on('ended', () => {
        localStorage.removeItem(key);
      });

      const lastTime = parseFloat(localStorage.getItem(key));
      if (resumeable && lastTime) {
        this.player.currentTime(lastTime);
        this.player.play();
      }
    });
  }
}

ResumePlayback.defaultState = {};

ResumePlayback.VERSION = VERSION;

videojs.registerPlugin('resumePlayback', ResumePlayback);

export default ResumePlayback;

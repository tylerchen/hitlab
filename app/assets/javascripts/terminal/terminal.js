import $ from 'jquery';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';

export default class GLTerminal {
  constructor(options = {}) {
    this.options = Object.assign({}, {
      cursorBlink: true,
      screenKeys: true,
    }, options);

    this.container = document.querySelector(options.selector);

    this.setSocketUrl();
    this.createTerminal();

    $(window)
      .off('resize.terminal')
      .on('resize.terminal', () => {
        this.terminal.fit();
      });
  }

  setSocketUrl() {
    const { protocol, hostname, port } = window.location;
    const wsProtocol = protocol === 'https:' ? 'wss://' : 'ws://';
    const path = this.container.dataset.projectPath;

    this.socketUrl = `${wsProtocol}${hostname}:${port}${path}`;
  }

  createTerminal() {
    Terminal.applyAddon(fit);

    this.terminal = new Terminal(this.options);

    this.socket = new WebSocket(this.socketUrl, ['terminal.gitlab.com']);
    this.socket.binaryType = 'arraybuffer';

    this.terminal.open(this.container);
    this.terminal.fit();
    this.terminal.focus();

    this.socket.onopen = () => {
      this.runTerminal();
    };
    this.socket.onerror = () => {
      this.handleSocketFailure();
    };
  }

  runTerminal() {
    const decoder = new TextDecoder('utf-8');
    const encoder = new TextEncoder('utf-8');

    this.terminal.on('data', data => {
      this.socket.send(encoder.encode(data));
    });

    this.socket.addEventListener('message', ev => {
      this.terminal.write(decoder.decode(ev.data));
    });

    this.isTerminalInitialized = true;
    this.terminal.fit();
  }

  handleSocketFailure() {
    this.terminal.write('\r\nConnection failure');
  }
}

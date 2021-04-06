import { XMM0Send, XMM0Read, XMM0Leave } from './XMM0Api.js';
import aes256 from 'aes256';
//const aes256 = require('aes256');

class XMM0History {

	constructor(conn) {
		this.conn = conn;
		this.onInterval = this.onInterval.bind(this);
		this.release = this.release.bind(this);
		this.changed = this.changed.bind(this);
		this.send = this.send.bind(this);
		this.interval = setInterval(() => { this.onInterval(); }, 1000);
		this.clients = [];
		this.messages = [];
		this.previous = 0;
	}

	onInterval() {
		XMM0Read(this.conn.id, this.conn.uid).then(res => {
			var a = res.data;
			for (var i = 0; i < a.length; ++i) {
				var x = a[i];
				if (x.event == "message") {
					var content = aes256.decrypt(this.conn.password, x.info.content);
					var signature = `${x.info.client}:`;
					if (content.startsWith(signature)) {
						this.messages.push({
							client: x.info.client,
							content: content.substring(signature.length),
							local: false
						});
					}
					else {
						this.messages.push({
							client: x.info.client,
							content: null,
							local: false
						});
					}
				}
				else if (x.event == "room") {
					if (x.info.action == "join") {
						this.clients.push(x.info.client);
					}
					else if (x.info.action == "leave") {
						var j = this.clients.findIndex(y => { return y == x.info.client; });
						if (j != -1) {
							this.clients.splice(j, 1);
						}
					}
				}
			}
		}).catch(err => {
			alert("XMM0Read Failed.");
		});
	}

	release() {
		clearInterval(this.interval);
		XMM0Leave(this.conn.id, this.conn.uid).catch(err => {
			alert("XMM0Leave Failed.");
		});
	}

	send(content) {
		XMM0Send(this.conn.id, this.conn.uid, aes256.encrypt(this.conn.password, `${this.conn.name}:${content}`)).catch(err => {
			alert("XMM0Send Failed.");
		});
		this.messages.push({
			client: this.conn.name,
			content: content,
			local: true
		});
	}

	changed() {
		if (this.previous != this.messages.length) {
			this.previous = this.messages.length;
			return true;
		}
		else {
			return false;
		}
	}

}

export default XMM0History;
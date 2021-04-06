import './XMM0Variables.css';
import './XMM0Room.css';
import XMM0Button from './XMM0Button.js';
import XMM0Input from './XMM0Input.js';
import XMM0Home from './XMM0Home.js';
import XMM0Connection from './XMM0Connection.js';
import XMM0History from './XMM0History.js';
import { XMM0Send, XMM0Read } from './XMM0Api.js';
import React from 'react';
import aes256 from 'aes256';

class XMM0RoomMessage extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		var className = `${"XMM0RoomMessage-Box"} ${this.props.message.local ? "XMM0RoomMessage-Local" : "XMM0RoomMessage-Remote"}`;
		return (
			<div className="XMM0RoomMessage-Root">
				<div className={className}>
					<div className="XMM0RoomMessage-Title">
						{this.props.message.client}
					</div>
					<p className="XMM0RoomMessage-Body">
						{this.props.message.content}
					</p>
				</div>
			</div>
		);
	}

}

class XMM0RoomTop extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.inRoom) {
			return (
				<div className="XMM0Room-Top">
					{this.props.history.messages.map((e, i) => {
						return (<XMM0RoomMessage message={e}/>);
					})}
				</div>
			);
		}
		else {
			return (
				<div className="XMM0Room-Top">
				</div>
			);
		}
	}

}

class XMM0Room extends React.Component {

	constructor(props) {
		super(props);
		this.onRoom = this.onRoom.bind(this);
		this.onSend = this.onSend.bind(this);
		this.onInterval = this.onInterval.bind(this);
		this.histories = {};
		this.state = {
			inRoom: false,
			id: "",
			password: "",
			uid: "",
			name: "",
			chatInput: "",
			xid: ""
		};
	}

	onRoom(conn) {
		var xid = `${conn.id}:${conn.uid}`;
		if (this.histories[xid] === undefined) {
			var history = new XMM0History(conn);
			this.histories[xid] = history;
		}
		this.setState({
			inRoom: true,
			id: conn.id,
			password: conn.password,
			uid: conn.uid,
			name: conn.name,
			chatInput: "",
			xid: xid
		});
	}

	onSend() {
		this.histories[this.state.xid].send(this.state.chatInput);
		this.setState({ chatInput: "" });
	}

	onInterval() {
		if (this.state.inRoom) {
			if (this.histories[this.state.xid].changed()) {
				this.forceUpdate();
			}
		}
	}

	componentDidMount() {
		this.interval = setInterval(() => { this.onInterval(); }, 32);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		if (this.state.inRoom) {
			if (this.histories[this.state.xid].changed()) {
				this.forceUpdate();
			}
		}
		return (
			<div className="XMM0Room-Root">
				<XMM0Home className="XMM0Room-Home" onRoom={(x)=>{ this.onRoom(x); }}/>
				<div className="XMM0Room-Main">
					<div className="XMM0Room-Left">
						<XMM0RoomTop inRoom={this.state.inRoom} history={this.histories[this.state.xid]}/>
						<div className="XMM0Room-Bottom">
							<XMM0Input value={this.state.chatInput} className="XMM0Room-Chat" onChange={(x)=>{this.setState({ chatInput: x });}} disabled={!this.state.inRoom}/>
							<XMM0Button className="XMM0Room-Send" label="Send" onClick={()=>{this.onSend();}} disabled={!this.state.inRoom}/>
						</div>
					</div>
					<div className="XMM0Room-Right">
						<div className="XMM0Room-Info">
						</div>
					</div>
				</div>
			</div>
		);
	}

}

export default XMM0Room;
import './XMM0Variables.css';
import './XMM0Home.css';
import XMM0Button from './XMM0Button.js';
import XMM0Input from './XMM0Input.js';
import XMM0Connection from './XMM0Connection.js';
import { XMM0Create, XMM0Join } from './XMM0Api.js';
import React, { useState } from 'react';

class XMM0HomeInput extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="XMM0HomeInput-Root">
				<div className="XMM0HomeInput-Label">
					{this.props.label || "None"}
				</div>
				<XMM0Input disabled={this.props.disabled || false} className="XMM0HomeInput-Input" onChange={(x) => { this.props.onChange(x); }}/>
			</div>
		);
	}

}

class XMM0HomeRoom extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="XMM0HomeRoom-Root" onClick={ (e) => { this.props.onRoom(this.props.connection); } }>
				<div className="XMM0HomeRoom-Body">
					{this.props.connection.id}
					<br/>
					{`${this.props.connection.name} (${this.props.connection.uid})`}
				</div>
			</div>
		);
	}

}

const XMM0Home = (props) => {
	const [ createName, setCreateName ] = useState("");
	const [ createPassword, setCreatePassword ] = useState("");
	const [ joinId, setJoinId ] = useState("");
	const [ joinName, setJoinName ] = useState("");
	const [ joinPassword, setJoinPassword ] = useState("");
	const [ createEnable, setCreateEnable ] = useState(false);
	const [ joinEnable, setJoinEnable ] = useState(false);
	const [ inputEnable, setInputEnable ] = useState(true);
	const [ roomList, setRoomList ] = useState([]);
	const checkInput = () => {
		var xCreateName = createName.match("^[a-zA-Z0-9]{4,}$");
		var xCreatePassword = createPassword.match("^[A-Za-z0-9!\"#$%&'()*+,-.\/:;<=>?@[\\\]^_`{|}~]{8,}$");
		var xJoinName = joinName.match("^[a-zA-Z0-9]{4,}$");
		var xJoinPassword = joinPassword.match("^[A-Za-z0-9!\"#$%&'()*+,-.\/:;<=>?@[\\\]^_`{|}~]{8,}$");
		var xJoinId = joinId.match("^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$");
		var xCreateLast = createEnable;
		var xJoinLast = joinEnable;
		setCreateEnable(xCreateName !== null && xCreatePassword !== null);
		setJoinEnable(xJoinName !== null && xJoinId !== null && xJoinPassword !== null);
	};
	const onCreateButton = () => {
		setInputEnable(false);
		setCreateEnable(false);
		setJoinEnable(false);
		XMM0Create().then(res => {
			var id = res.data.id;
			XMM0Join(id, createName).then(res => {
				var uid = res.data.id;
				var conn = new XMM0Connection(id, createPassword, uid, createName);
				setRoomList(roomList.concat([conn]));
				setInputEnable(true);
				checkInput();
				props.onRoom(conn);
			}).catch(err => {
				alert("XMM0Join Failed.");
			});
		}).catch(err => {
			alert("XMM0Create Failed.");
		});
	};
	const onJoinButton = () => {
		setInputEnable(false);
		setCreateEnable(false);
		setJoinEnable(false);
		XMM0Join(joinId, joinName).then(res => {
			var uid = res.data.id;
			var conn = new XMM0Connection(joinId, joinPassword, uid, joinName);
			setRoomList(roomList.concat([conn]));
			setInputEnable(true);
			checkInput();
			props.onRoom(conn);
		}).catch(err => {
			alert("XMM0Join Failed.");
		});
	};
	return (
		<div className={ `XMM0Home-Root ${props.className || ""}` }>
			<div className="XMM0Home-Title">
				xmm0
			</div>
			<div className="XMM0Home-Create">
				<div className="XMM0Home-Subtitle">
					Create Room
				</div>
				<XMM0HomeInput disabled={(props.disabled || false) || !inputEnable} label="Name:" onChange={(x) => { setCreateName(x); checkInput(); }}/>
				<XMM0HomeInput disabled={(props.disabled || false) || !inputEnable} label="Password:" onChange={(x) => { setCreatePassword(x); checkInput(); }}/>
				<XMM0Button disabled={!createEnable || (props.disabled || false)} className="XMM0HomeButton" label="Create Room" onClick={() => { onCreateButton(); }}/>
			</div>
			<div className="XMM0Home-Join">
				<div className="XMM0Home-Subtitle">
					Join Room
				</div>
				<XMM0HomeInput disabled={(props.disabled || false) || !inputEnable} label="Room ID:" onChange={(x) => { setJoinId(x); checkInput(); }}/>
				<XMM0HomeInput disabled={(props.disabled || false) || !inputEnable} label="Name:" onChange={(x) => { setJoinName(x); checkInput(); }}/>
				<XMM0HomeInput disabled={(props.disabled || false) || !inputEnable} label="Password:" onChange={(x) => { setJoinPassword(x); checkInput(); }}/>
				<XMM0Button disabled={!joinEnable || (props.disabled || false)} className="XMM0HomeButton" label="Join Room" onClick={() => { onJoinButton(); }}/>
			</div>
			<div className="XMM0Home-Subtitle">
				Rooms
			</div>
			<div className="XMM0Home-List">
				{roomList.map((e, i) => {
					return (<XMM0HomeRoom connection={e} onRoom={ (x) => { props.onRoom(x); } }/>);
				})}
			</div>
		</div>
	);
};


/*
class XMM0Home extends React.Component {

	constructor(props) {
		super(props);
		this.createName = "";
		this.createPassword = "";
		this.onCreateButton = this.onCreateButton.bind(this);
		this.joinId = "";
		this.joinName = "";
		this.joinPassword = "";
		this.onJoinButton = this.onJoinButton.bind(this);
		this.createEnable = false;
		this.joinEnable = false;
		this.inputEnable = true;
		this.checkInput = this.checkInput.bind(this);
		this.roomList = [];
	}

	checkInput() {
		var createName = this.createName.match("^[a-zA-Z0-9]{4,}$");
		var createPassword = this.createPassword.match("^[A-Za-z0-9!\"#$%&'()*+,-.\/:;<=>?@[\\\]^_`{|}~]{8,}$");
		var joinName = this.joinName.match("^[a-zA-Z0-9]{4,}$");
		var joinPassword = this.joinPassword.match("^[A-Za-z0-9!\"#$%&'()*+,-.\/:;<=>?@[\\\]^_`{|}~]{8,}$");
		var joinId = this.joinId.match("^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$");
		var createLast = this.createEnable;
		var joinLast = this.joinEnable;
		this.createEnable = createName !== null && createPassword !== null;
		this.joinEnable = joinName !== null && joinId !== null && joinPassword !== null;
		if (createLast != this.createEnable || joinLast != this.joinEnable) {
			this.forceUpdate();
		}
	}

	onCreateButton() {
		this.inputEnable = false;
		this.createEnable = false;
		this.joinEnable = false;
		XMM0Create().then(res => {
			var id = res.data.id;
			XMM0Join(id, this.createName).then(res => {
				var uid = res.data.id;
				var conn = new XMM0Connection(id, this.createPassword, uid, this.createName);
				this.roomList.push(conn);
				this.inputEnable = true;
				this.checkInput();
				this.forceUpdate();
				this.props.onRoom(conn);
			}).catch(err => {
				alert("XMM0Join Failed.");
			});
		}).catch(err => {
			alert("XMM0Create Failed.");
		});
	}

	onJoinButton() {
		this.inputEnable = false;
		this.createEnable = false;
		this.joinEnable = false;
		XMM0Join(this.joinId, this.joinName).then(res => {
			var uid = res.data.id;
			var conn = new XMM0Connection(this.joinId, this.joinPassword, uid, this.joinName);
			this.roomList.push(conn);
			this.inputEnable = true;
			this.checkInput();
			this.forceUpdate();
			this.props.onRoom(conn);
		}).catch(err => {
			alert("XMM0Join Failed.");
		});
	}

	render() {
		return (
			<div className={ `XMM0Home-Root ${this.props.className || ""}` }>
				<div className="XMM0Home-Title">
					xmm0
				</div>
				<div className="XMM0Home-Create">
					<div className="XMM0Home-Subtitle">
						Create Room
					</div>
					<XMM0HomeInput disabled={(this.props.disabled || false) || !this.inputEnable} label="Name:" onChange={(x) => { this.createName = x; this.checkInput(); }}/>
					<XMM0HomeInput disabled={(this.props.disabled || false) || !this.inputEnable} label="Password:" onChange={(x) => { this.createPassword = x; this.checkInput(); }}/>
					<XMM0Button disabled={!this.createEnable || (this.props.disabled || false)} className="XMM0HomeButton" label="Create Room" onClick={() => { this.onCreateButton(); }}/>
				</div>
				<div className="XMM0Home-Join">
					<div className="XMM0Home-Subtitle">
						Join Room
					</div>
					<XMM0HomeInput disabled={(this.props.disabled || false) || !this.inputEnable} label="Room ID:" onChange={(x) => { this.joinId = x; this.checkInput(); }}/>
					<XMM0HomeInput disabled={(this.props.disabled || false) || !this.inputEnable} label="Name:" onChange={(x) => { this.joinName = x; this.checkInput(); }}/>
					<XMM0HomeInput disabled={(this.props.disabled || false) || !this.inputEnable} label="Password:" onChange={(x) => { this.joinPassword = x; this.checkInput(); }}/>
					<XMM0Button disabled={!this.joinEnable || (this.props.disabled || false)} className="XMM0HomeButton" label="Join Room" onClick={() => { this.onJoinButton(); }}/>
				</div>
				<div className="XMM0Home-Subtitle">
					Rooms
				</div>
				<div className="XMM0Home-List">
					{this.roomList.map((e, i) => {
						return (<XMM0HomeRoom connection={e} onRoom={ (x) => { this.props.onRoom(x); } }/>);
					})}
				</div>
			</div>
		);
	}

}
*/

export default XMM0Home;
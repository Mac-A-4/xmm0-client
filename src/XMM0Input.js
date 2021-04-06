import './XMM0Variables.css';
import './XMM0Input.css';
import React from 'react';

class XMM0Input extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.value === undefined) {
			return (
				<input onChange={ (e) => { this.props.onChange(e.target.value); } } className={`XMM0Input-Input ${this.props.className || ""}`} disabled={ this.props.disabled || false } type="text"/>
			);
		}
		else {
			return (
				<input value={this.props.value} onChange={ (e) => { this.props.onChange(e.target.value); } } className={`XMM0Input-Input ${this.props.className || ""}`} disabled={ this.props.disabled || false } type="text"/>
			);
		}
	}

}

export default XMM0Input;
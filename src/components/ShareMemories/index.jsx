import React, { Component } from 'react';
import './styles.scss';
import uiAction from '../../actions/ui';
import { extend } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CommonService from '../../services/common';

class ShareMemories extends Component {
  constructor(props) {
    super(props);

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.state = {
      registrationEmail: ''
    }
  }

  handleButtonClick() {
    const { authenticated, uiAction } = this.props;

    if (authenticated) {
      CommonService.showError('You are already logged in.');
      return;
    }

    uiAction.registrationFormSetEmail(this.state.registrationEmail);
    uiAction.showRegisterPopup();
  }

  render() {
    return (
      <div className="share-memories">
        <div className="con-mem">
          <h2>{this.props.title}</h2>
          <div className="desc">{this.props.desc}</div>
          <div className="become-member">
            <div className="row">
              <input type="email"
                     className="mail"
                     placeholder="Enter your email address"
                     onChange={(event) => this.setState({ registrationEmail: event.target.value })}
              />
            </div>
            <div className="action">
              <a className="btn" onClick={this.handleButtonClick}>
                Become a Member
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.auth,
    ui: state.ui
  }
};

const matchDispatchToProps = (dispatch) => {
  return {
    uiAction: bindActionCreators(extend({}, uiAction), dispatch)
  };
};

export default connect(mapStateToProps, matchDispatchToProps)(ShareMemories);

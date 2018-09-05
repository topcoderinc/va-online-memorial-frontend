import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Pagination from "react-js-pagination";
import _ from 'lodash';
import './admin-user-manager.scss';
import { DEAULT_USER_LIMIT } from "../../config";
import APIService from "../../services/api";
import CommonService from "../../services/common";

class AdminUserManager extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      pageNumber: 1,
      opUser: {},
      isShowDialog: false,
      password: '',
      showError: false,
    };
    this.submit = this.submit.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  onPageChange(pageNumber) {
    this.setState({pageNumber}, () => {
      this.search();
    })
  }

  onSearchTextChange(searchText) {
    this.setState({searchText}, () => {
      this.search();
    })
  }

  updateOpUserProp(key, value) {
    const opUser = _.clone(this.state.opUser);
    opUser[key] = value;
    this.setState({opUser});
  }

  search() {
    const {pageNumber, searchText} = this.state;
    const query = {offset: (pageNumber - 1) * DEAULT_USER_LIMIT, limit: DEAULT_USER_LIMIT};
    if (searchText.length > 0) {
      query.name = searchText;
    }
    return this.props.onSearch(query);
  }

  submit() {
    const {password, opUser} = this.state;
    const isSave = !!opUser.id;
    const errFields = [];
    const body = {};

    const checkValue = (key, label, v) => {
      if (!v || v.trim().length === 0) {
        errFields.push(label);
      } else {
        body[key] = v.trim();
      }
    };

    checkValue('username', 'Username', opUser.username);
    checkValue('email', 'Email', opUser.email);
    if (!isSave || (password !== "`")) {
      checkValue('password', 'Password', password);
    }
    checkValue('role', 'Role', opUser.role);

    if (errFields.length > 0) {
      return CommonService.showError(`${errFields.join(', ')} cannot be empty`);
    }
    if (!CommonService.validateEmail(body.email)) {
      return CommonService.showError(`Email address is illegal`);
    }

    if (isSave) {
      APIService.updateUser(opUser.id, body).then(() => {
        CommonService.showSuccess("User updated successful");
        this.setState({isShowDialog: false});
        setTimeout(() => this.search(), 10);
      }).catch((err) => {
        CommonService.showError( CommonService.getErrorMsg(err));
      });
    } else {
      APIService.createUser(body).then(() => {
        CommonService.showSuccess("User created successful");
        this.setState({isShowDialog: false});
        setTimeout(() => this.search(), 10);
      }).catch((err) => {
        CommonService.showError(CommonService.getErrorMsg(err));
      });
    }
  }

  update(id, body) {
    APIService.updateUser(id, body).then(() => {
      CommonService.showSuccess("User updated successful");
      setTimeout(() => this.search(), 10);
    }).catch((err) => {
      CommonService.showError( CommonService.getErrorMsg(err));
    });
  }

  render() {
    const {onDelete, onCreate, users, onSearch} = this.props;
    const opUser = this.state.opUser;
    const getCurrentPage = () => {
      return (users.offset || 0) / (users.limit || 1) + 1;
    };

    const isActive = (user) => {
      return user.status === 'Active';
    };

    return (
      <div className="admin-user-manager">
        <h2 className="admin-user-manager__title">
          <span>{"User Management"}</span>
          <a className="btn" onClick={() => this.setState({isShowDialog: true, opUser: {}, password: ''})}>New User</a>
        </h2>


        <input className={"search-input"} value={this.state.searchText} placeholder={"Search By Name"}
               onChange={e => this.onSearchTextChange(e.target.value)}/>
        {
          users && users.items && users.items.length > 0 &&
          <div className="user-list">
            {users.items.map((user, index) => (
              <div className={"user-item"} key={index}>
                <div className={"line"}>
                  <div className={"item"}>
                    <span className={"key"}>Email:</span>
                    <span className={"value"}>{user.email}</span>
                  </div>
                  <div className={"item"}>
                    <span className={"key"}>Username:</span>
                    <span className={"value"}>{user.username}</span>
                  </div>
                </div>

                <div className={"line"}>
                  <div className={"item"}>
                    <span className={"key"}>Role:</span>
                    <span className={"value"}>{user.role}</span>
                  </div>
                  <div className={"item"}>
                    <span className={"key"}>Status:</span>
                    <span className={"value"}>{user.status}</span>
                  </div>
                </div>

                <div className={"line btns"}>
                  <a className={`btn ${isActive(user) ? 'btn-red' : '' }`}
                     onClick={() => this.update(user.id, {status: isActive(user) ? 'Inactive' : 'Active'})}
                  >
                    {isActive(user) ? 'Deactivate' : 'Active'}
                  </a>
                  <a className={"btn"}
                     onClick={() => this.setState({isShowDialog: true, opUser: user, password: '`'})}>Edit</a>
                </div>
              </div>))}
          </div>
        }

        {
          (!users || !users.items || users.items.length <= 0) && <div className={"no-records"}>No records</div>}

        <div className={"pagination-wrap"}>
          <Pagination
            hideDisabled
            activePage={getCurrentPage()}
            itemsCountPerPage={users.limit}
            totalItemsCount={users.total}
            pageRangeDisplayed={3}
            onChange={this.onPageChange}
            linkClassFirst={'hide'}
            linkClassLast={'hide'}
            nextPageText={"Next"}
            prevPageText={"Prev"}
            linkClassNext={"next"}
            linkClassPrev={"prev"}
          />
        </div>


        <div className={`popup-wrap ${this.state.isShowDialog ? 'on' : ''}`}>
          <div className={"popup"}>
            <a className="close"
               onClick={() => this.setState({isShowDialog: false})}/>

            <header>{opUser.id ? 'Edit User' : 'Add new User'}</header>

            <div className={"fm"}>
              <div className={"input-line"}>
                <div className={"title"}>Username :</div>
                <input className={"input"}
                       value={opUser.username || ''}
                       onChange={e => this.updateOpUserProp('username', e.target.value)}
                />
              </div>

              <div className={"input-line"}>
                <div className={"title"}>Email :</div>
                <input className={"input"}
                       value={opUser.email || ''}
                       onChange={e => this.updateOpUserProp('email', e.target.value)}
                />
              </div>

              <div className={"input-line"}>
                <div className={"title"}>Password :</div>
                <input className={"input"} type={"password"}
                       value={this.state.password}
                       onChange={e => this.setState({password: e.target.value})}
                />
              </div>

              <div className={"input-line"}>
                <div className={"title"}>Role</div>
                <select className={"selectctrl input"}
                        onChange={e => this.updateOpUserProp('role', e.target.value)}
                        value={opUser.role || ''}>
                  <option value={""}/>
                  <option value={"user"}>user</option>
                  <option value={"admin"}>admin</option>
                </select>
              </div>
            </div>
            <div className={"flex1"}/>
            <div className={"actions fx"}>
              <a className={"btn btn-clear"} onClick={() => this.setState({isShowDialog: false})}>Cancel</a>
              <a className={"btn"} onClick={this.submit}>Ok</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


AdminUserManager.defaultProps = {};

AdminUserManager.props = {
  onCreate: PropTypes.func,
  onSearch: PropTypes.func,
  users: PropTypes.object,
};

export default AdminUserManager;

import {
  DEFAULT_SERVER_ERROR
} from '../config';
import { toast } from 'react-toastify';
import * as NProgress from 'nprogress';
import * as moment from 'moment';
import { createBrowserHistory } from 'history';

const browserHistory = createBrowserHistory();

// use new progress
let __requestCount = 0;

function startNProgress() {
  if (__requestCount <= 0) {
    NProgress.start();
  }
  __requestCount += 1;
  console.log(`new request, request count = ${__requestCount}`);
}

function doneNProgress() {
  __requestCount -= 1;
  if (__requestCount <= 0) {
    NProgress.done();
  }
  console.log(`request done, request count = ${__requestCount}`);
}

export default class CommonService {

  /**
   * get error message from request error
   * @param err the request error
   * @return {*}
   */
  static getErrorMsg(err) {

    if (!err || !err.response) {
      return "Network cannot be reached."
    }

    const body = err.response.body;
    if (!body || !body.message) {
      return DEFAULT_SERVER_ERROR;
    }
    return body.message;
  }

  /**
   * get browser history
   */
  static getBrowserHistory() {
    return browserHistory;
  }

  /**
   * show error or msg
   * @param err the error text or object
   */
  static showError(err) {
    if (typeof err === 'string') {
      toast(err, {type: 'error'});
    } else {
      toast(this.getErrorMsg(err), {type: 'error'})
    }
  }

  /**
   * show success msg
   * @param msg the text msg
   */
  static showSuccess(msg) {
    toast(msg, {type: 'info'});
  }

  static doRequest() {

  }

  static progressInterceptor(req) {
    req.on('request', () => {
      startNProgress();
    });
    req.on('response', () => {
      doneNProgress();
    });
    req.on('error', () => {
      doneNProgress();
    });
  }

  /**
   * get entity author
   * @param entity the entity
   */
  static getAuthor(entity) {
    if (!entity.createdBy) {
      return 'None';
    }
    return `${entity.createdBy.firstName} ${entity.createdBy.midName} ${entity.createdBy.lastName}`;
  }

  /**
   * get format time
   * @param entity the entity
   */
  static getCreateTime(entity) {
    return moment(entity.createdAt).format('DD MMM YYYY')
  }

  /**
   * check is nok via the nok requests
   * @param nokRequests
   */
  static isNok(nokRequests) {
    for (let i = 0; i < (nokRequests.items ? nokRequests.items.length : 0); i += 1) {
      if (nokRequests.items[i].status === 'Approved') {
        return true;
      }
    }
    return false;
  }

  /**
   * check email
   * @param email the email address
   */
  static validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  /**
   * get query param
   */
  static getParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
}

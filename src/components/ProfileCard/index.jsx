import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import {Scrollbars} from 'react-custom-scrollbars';
import './profile-card.scss';
import CommonService from "../../services/common";
import ProfilePicture from '../ProfilePicture';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as forms from '../../constants/forms';

class ProfileCard extends Component {
  constructor(props) {
    super(props);
    
    this.togglePopup = this.togglePopup.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleStoryContentInputChange = this.handleStoryContentInputChange.bind(this);
    this.hidePopup = this.hidePopup.bind(this);
    this.hideAllPopup = this.hideAllPopup.bind(this);
    this.toggleBadgeSelect = this.toggleBadgeSelect.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.resetPopup = this.resetPopup.bind(this);
    this.onAddEvent = this.onAddEvent.bind(this);
    this.onAddStory = this.onAddStory.bind(this);
    this.onAddTestimonial = this.onAddTestimonial.bind(this);
    this.onUploadPhoto = this.onUploadPhoto.bind(this);
    this.onAddBadge = this.onAddBadge.bind(this);
    this.state = {
      isTimelineEvents: false,
      activePop: '',
      popupActive: '',
      
      nokError: {},
      
      // add event values
      eventDay: '',
      eventMonth: '',
      eventYear: '',
      eventSelected: '',
      
      // add story form values
      storyTitle: '',
      storyContent: '',
      
      // add testimonial form values
      testimonialTitle: '',
      testimonialContent: '',
      
      // add badge
      badgeSelected: {},
      
      //upload photo or nok files
      files: [],
      
      //flag values
      flagEntityType: '',
      flagEntityId: '',
      activeFlagId: 1,
    };
  }

  componentDidMount() {
    const that = this;
    window.showProfileFlagPopUp = (type, id) => {
      that.showPopup('isFlagginPopup')();
      that.setState({
        flagEntityType: type,
        flagEntityId: id,
      }, () => {
        that.showPopup('isFlagginPopup');
      });
    };
  }

  static containsOnlyWhitespace(string) {
    return /^\s+$/.test(string);
  }

  componentWillUnmount() {
    delete window.showProfileFlagPopUp;
  }
  
  // flie drop handler
  onDrop(files) {
    this.setState({
      files
    });
  }
  
  //toggleBadgeSelect
  toggleBadgeSelect(index) {
    const badgeSelected = _.clone(this.state.badgeSelected);
    badgeSelected[ index ] = !badgeSelected[ index ];
    this.setState({ badgeSelected });
  }
  
  handleOutsideClick(e) {
    // ignore clicks on the component itself
    if (this.node.contains(e.target)) {
      return;
    }
    
    this.togglePopup(this.state.activePop)();
  }

  handleStoryContentInputChange(event) {
    if (event.target.value.length > forms.CHARACTER_LIMIT_255) {
      return;
    }
    this.setState({ storyContent: event.target.value });
  }
  
  // renderThumb
  renderThumb({ style, ...props }) {
    const thumbStyle = {
      backgroundColor: `rgb(0,0,0)`,
      width: `6px`,
      borderRadius: `10px`
    };
    
    return (
      <div
        style={{ ...style, ...thumbStyle }}
        {...props} />
    )
  }

// hidePopup
  hidePopup() {
    const activePop = this.state.activePop;
    let popState = {};
    popState[ activePop ] = false;
    this.setState(popState);
    document.removeEventListener('click', this.handleOutsideClick, false);
    this.setState({ 'activePop': '' });
  }
  
  hideAllPopup() {
    let newState = {};
    newState.popupActive = '';
    this.setState(newState);
    document.querySelector('body').classList.remove('has-popup');
    
    this.resetPopup();
  }
  
  resetPopup() {
    this.refs.photoCaption.value = "";
    this.setState({ 'files': [] });
  }
  
  stopPropagation(e) {
    e.stopPropagation();
  }
  
  showPopup(popupName) {
    return (() => {
      this.hidePopup();
      let newState = {};
      newState.popupActive = popupName;
      newState.nokError = {};
      this.setState(newState);
      document.querySelector('body').classList.add('has-popup');
    })
  }
  
  togglePopup(popName) {
    
    return ((e) => {
      if (!this.state[ popName ]) {
        this.setState({ 'activePop': popName });
        document.addEventListener('click', this.handleOutsideClick, false);
      } else {
        this.setState({ 'activePop': '' });
        document.removeEventListener('click', this.handleOutsideClick, false);
      }
      
      this.setState(prevState => {
          let newState = {};
          newState[ popName ] = !prevState[ popName ];
          return (newState);
        }
      )
    })
    
  }

  /**
   * send nok request
   */
  sendRequest() {
    let nokFullName = this.refs.nokFullName.value;
    let nokEmail = this.refs.nokEmail.value;
    let error = {
      nokFullName: false,
      nokEmail: false
    };
    let isValid = true;
    const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    if (!nokFullName || ProfileCard.containsOnlyWhitespace(nokFullName)) {
      error.nokFullName = true;
      isValid = false;
    }
    if (!nokEmail || !nokEmail.match(pattern)) {
      error.nokEmail = true;
      isValid = false;
    }
    
    this.setState({
      nokError: { ...error }
    });
    
    if (error.nokEmail || error.nokFullName) {
      return;
    }
    if (this.state.files.length <= 0) {
      return CommonService.showError("You at least need choose one proof file.")
    }
    
    if (isValid) {
      this.props.onAddNOK(this.state.files, nokFullName, nokEmail, () => {
        nokFullName = '';
        nokEmail = '';
        this.hideAllPopup();
      });
    }
  }
  
  onAddEvent() {
    let { eventYear, eventMonth, eventDay, eventSelected } = this.state;
    eventMonth = _.toNumber(eventMonth);
    eventYear = _.toNumber(eventYear);
    eventDay = _.toNumber(eventDay);

    if (!this.isAddEventDateValid(eventYear, eventMonth, eventDay)) {
      return;
    }

    if (eventSelected <= 0) {
      return CommonService.showError("You must select a event");
    }

    const dateString = `${eventYear}-${eventMonth}-${eventDay}`;

    this.props.onAddEvent({ eventDate: dateString, eventTypeId: eventSelected }, () => {
      this.setState({
        eventYear: '', eventMonth: '', eventDay: '', eventSelected: 0
      });
      this.hideAllPopup();
    })
  }

  isAddEventDateValid(year, month, day) {
    if (!_.isNumber(month) || month < 1 || month > 12) {
      CommonService.showError("You must enter a valid month");
      return false;
    }
    if (!_.isNumber(day) || day < 1 || day > 31) {
      CommonService.showError("You must enter a valid day");
      return false;
    }
    if (!_.isNumber(year) || year < 1000 || year > 3000) {
      CommonService.showError("You must enter a valid year");
      return false;
    }

    const newDate = moment(`${year}-${month}-${day}`, 'YYYY-M-D', true);

    if (!newDate.isValid()) {
      // Re-format the Date String in the same order as the input fields.
      const inputDate = `${month}-${day}-${year}`;
      CommonService.showError(`${inputDate} is not a valid date`);
      return false;
    }

    return true;
  }
  
  /**
   * add testimonial
   */
  onAddTestimonial() {
    const { testimonialTitle, testimonialContent } = this.state;
    if (_.isEmpty(testimonialTitle)) {
      return CommonService.showError("Title should not empty");
    }
    if (_.isEmpty(testimonialContent)) {
      return CommonService.showError("Content should not empty");
    }
    this.props.onAddTestimonial({ title: testimonialTitle, text: testimonialContent }, () => {
      this.setState({
        testimonialTitle: '', testimonialContent: '',
      });
      this.hideAllPopup();
    });
  }
  
  /**
   * upload photo
   */
  onUploadPhoto() {
    const title = this.refs.photoCaption.value;
    const files = this.state.files;

    if (files.length <= 0) {
      return CommonService.showError("You at least need choose one photo.");
    }
    if (_.isEmpty(title) || ProfileCard.containsOnlyWhitespace(title)) {
      return CommonService.showError("Photo caption should not be empty.");
    }
    
    this.props.onUploadPhoto(files, title, () => {
      this.resetPopup();
      this.hideAllPopup();
    });
  }
  
  /**
   * upload photo
   */
  onAddBadge() {
    const { badgeSelected } = this.state;
    const selectBadges = [];
    _.each(badgeSelected, (v, k) => {
      if (v) selectBadges.push(k);
    });
    if (selectBadges.length <= 0) {
      return CommonService.showError("You must at least select one badge.");
    }
    
    this.props.onAddBadge(selectBadges, () => {
      this.setState({
        badgeSelected: {},
      });
      this.hideAllPopup();
    });
  }
  
  /**
   * add story
   */
  onAddStory() {
    const { storyTitle, storyContent } = this.state;
    if (_.isEmpty(storyTitle)) {
      return CommonService.showError("Title should not be empty.");
    }
    if (_.isEmpty(storyContent)) {
      return CommonService.showError("Message should not be empty.");
    }
    this.props.onAddStory({ title: storyTitle, text: storyContent }, () => {
      this.setState({
        storyTitle: '', storyContent: '',
      });
      this.showPopup('isThanksPop')();
    });
  }
  
  onAddFlag() {
    const $p = !!this.props.attr ? this.props.attr : {};
    const flag = $p.flaggingOpts[ this.state.activeFlagId - 1 ];
    const entity = {
      "postId": this.state.flagEntityId,
      "postType": this.state.flagEntityType,
      "reason": flag.reason,
      "explanation": flag.details,
      "status": "Requested"
    };
    
    this.props.onAddFlag(entity, () => {
      this.setState({
        activeFlagId: 1, flagEntityId: '', flagEntityType: ''
      });
      this.showPopup('isThanksPop')();
    })
  }

  render() {
    const $p = !!this.props.attr ? this.props.attr : {};
    return (
      <div className="profile-card">
        <div className="bar-quotes-n-activity-wrap">
          <div className="viewport">
            <div className="bar-quotes-n-activity">
              <div className="col">
                <div className="lead-msg">
                  <i className="ico-flower"></i>
                  
                  <h5>{$p.msgTitle}</h5>
                  <div className="desc">
                    Share a message, photo, or memory of {$p.profileName}. You can also research historical information (if applicable) and award a badge of honor. <a>Read more</a>
                  </div>
                </div>
              </div>
              <div className="col col-opts">
                <a className="btn btn-story"
                   onClick={this.showPopup('isWritePop')}
                ><span className="tx">Write Story</span> </a>
                <a className="btn btn-upload"
                   onClick={this.showPopup('isUploadPop')}><span className="tx">Upload</span> </a>
                <a className="btn btn-test"
                   onClick={this.showPopup('isTestimonialPop')}><span className="tx">Testimonial</span> </a>
                <a className="btn btn-badge"
                   onClick={this.showPopup('isBadgePop')}><span className="tx">Badge</span> </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="profile-details-wrap">
          <div className="viewport">
            <div className="profile-details">
              <ProfilePicture imageSrc={$p.profileImgSrc}
                              imageAlt={$p.profileName}>
                <a className="lnk send-request-lnk"
                   onClick={this.showPopup('isNokPopup')}
                >Send NOK Request</a>
              </ProfilePicture>
              <div className="bar-basicinfo">
                <div className="col col-name">
                  <h3>{$p.profileName}</h3>
                  <div className="meta">{$p.life}</div>
                </div>
                <div className="col col-opts align-r">
                  <div className="row">
                    <a className="btn btn-send-report"
                       onClick={this.togglePopup('isTimelineEvents')}
                    >View Timeline</a>
                  </div>
                  <div className="row st show-md">
                    <a className="lnk send-request-lnk"
                       onClick={this.showPopup('isNokPopup')}
                    >Send NOK Request</a>
                  </div>
                </div>
              
              </div>
              
              <div className="profile-more-details">
                <div className="fieldset">
                  <h6>Buried At</h6>
                  <div className="val">{$p.burriedAt}</div>
                </div>
                <div className="fieldset">
                  <h6>Burial Location</h6>
                  <div className="val">{$p.burrialLoc}</div>
                </div>
                <div className="fieldset">
                  <h6>War</h6>
                  <div className="val">{$p.war}</div>
                </div>
                <div className="fieldset">
                  <h6>Branch of Service</h6>
                  <div className="val">{$p.branch}</div>
                </div>
                <div className="fieldset">
                  <h6>Rank</h6>
                  <div className="val">{$p.rank}</div>
                </div>
                <div className="fieldset">
                  <h6>Campaign</h6>
                  <div className="val">{$p.campaign}</div>
                </div>
              </div>
            </div>
            
            <div className={"timeline-popup " + (this.state.isTimelineEvents ? 'on' : '')}
                 ref={node => { this.node = node; }}
            >
              
              <h2>{$p.profileName}</h2>
              <span className="pa"></span>
              <div className="tagline">Timeline Event</div>
              <div className="timeline-event-list">
                <a className="close"
                   onClick={this.hidePopup}
                > </a>
                <table className="event-table">
                  <tbody>
                  <tr>
                    <th>Timeline</th>
                    <th>Event</th>
                  </tr>
                  {
                    !!$p.timelineEvents && $p.timelineEvents.map((item, i) => {
                      return (
                        <tr key={i}>
                          <td>{moment(item[ 'eventDate' ]).format('Do MMM YYYY')}</td>
                          <td><span className={item[ 'eventType' ][ 'iconURL' ].toLowerCase()}>
                            {item[ 'eventType' ][ 'name' ]}</span></td>
                        </tr>
                      )
                    })
                  }
                  </tbody>
                </table>
                <div className="action">
                  <a className="btn btn-event"
                     onClick={this.showPopup('isEventPop')}
                  ><span className="ico">Event</span> </a>
                </div>
              </div>
            
            </div>
          </div>
        </div>
        
        <div className={"popup-wrap " + (this.state.popupActive === 'isWritePop' ? 'on' : '')}
             onClick={this.hideAllPopup}>
          <div className="popup"
               onClick={this.stopPropagation}
          >
            <header className="type-story">Write Story</header>
            <a className="close"
               onClick={this.hideAllPopup}
            > </a>
            <form className="frm">
              <div className="fieldset">
                <h6>Title</h6>
                <div className="val">
                  <input type="text"
                         value={this.state.storyTitle}
                         onChange={event => this.setState({ storyTitle: event.target.value })}
                         className="textctrl"
                         maxLength={forms.CHARACTER_LIMIT_255}
                  />
                </div>
              </div>
              <div className="fieldset">
                <h6>Message</h6>
                <div className="val">
                  <textarea className="textarea textctrl"
                            value={this.state.storyContent}
                            onChange={event => this.handleStoryContentInputChange(event)}
                            maxLength={forms.CHARACTER_LIMIT_255}
                  />
                </div>
                <div className="text-character-counter">
                  {this.state.storyContent.length} / 255 characters remaining
                </div>
              </div>
              <div className="actions fx">
                <a className="btn btn-clear"
                   onClick={this.hideAllPopup}
                >Cancel</a>
                <a className="btn"
                   onClick={this.onAddStory}
                >Post Story</a>
              </div>
            </form>
          </div>
        </div>
        
        
        <div className={"popup-wrap " + (this.state.popupActive === 'isFlagginPopup' ? 'on' : '')}
             onClick={this.hideAllPopup}>
          <div className="popup"
               onClick={this.stopPropagation}
          >
            <header>Why are you flagging this?</header>
            <a className="close"
               onClick={this.hideAllPopup}
            > </a>
            <form className="frm">
              {
                $p.flaggingOpts && $p.flaggingOpts.map((item, i) => {
                  return (
                    <div key={i} className={"fieldset fieldset-opt "}
                    >
                      <a className={"radioctrl "
                      + (this.state.activeFlagId === item.id ? 'checked' : '')}
                         onClick={() => { this.setState({ activeFlagId: item.id }) }}
                      >{item.reason}</a>
                      <div className="details hide-md">{item.details}</div>
                    </div>
                  )
                })
              }
              <div className="disclosure">Flagged content may in violation of the Veterans Legacy Memorial User
                Agreement, and will be reviewed and evaluated by an administrator.
              </div>
              <div className="actions fx spaced-lg">
                <a className="btn btn-clear"
                   onClick={this.hideAllPopup}
                >Cancel</a>
                <a className="btn btn-md"
                   onClick={() => this.onAddFlag()}
                >Submit Report</a>
              </div>
            </form>
          </div>
        </div>
        
        
        <div className={"popup-wrap " + (this.state.popupActive === 'isUploadPop' ? 'on' : '')}
             onClick={this.hideAllPopup}
             ref={node => { this.nodeStory = node; }}>
          <div className="popup"
               onClick={this.stopPropagation}
          >
            <header className="type-photo">Upload Photo</header>
            <a className="close"
               onClick={this.hideAllPopup}
            > </a>
            <form className="frm">
              <div className="fieldset">
                <h6>Photo Caption</h6>
                <div className="val">
                  <input type="text"
                         className="textctrl"
                         ref="photoCaption"/>
                </div>
              </div>
              <div className="fieldset">
                <h6>Upload Photo</h6>
                <div className="val">
                  <div className="textarea textctrl">
                    <Dropzone className="dropzone"
                              accept="image/jpeg, image/png"
                              onDrop={this.onDrop.bind(this)}>
                      <div className="drop-con hide-md">Drag and drop photo here or
                        <div className="spaced"><a className="btn btn-browse">Browse</a></div>
                        {
                          this.state.files.map(f => <div className="filename"
                                                         key={f.name}>{f.name} - {f.size} bytes</div>)
                        }
                      </div>
                      <div className="drop-con show-md">Open phone album</div>
                    
                    
                    </Dropzone>
                  </div>
                </div>
              </div>
              <div className="actions fx">
                <a className="btn btn-clear"
                   onClick={this.hideAllPopup}
                >Cancel</a>
                <a className="btn"
                   onClick={this.onUploadPhoto}
                >Upload Photo</a>
              </div>
            </form>
          </div>
        </div>
        
        <div className={"popup-wrap " + (this.state.popupActive === 'isEventPop' ? 'on' : '')}
             onClick={this.hideAllPopup}
             ref={node => { this.nodeStory = node; }}>
          <div className="popup fluid-h"
               onClick={this.stopPropagation}
          >
            <header className="type-event">Add Event</header>
            <a className="close"
               onClick={this.hideAllPopup}
            > </a>
            <form className="frm">
              <div className="fieldset fieldset-date">
                <div className="field-gr mm">
                  <h6>Month</h6>
                  <div className="val">
                    <input type="number" value={this.state.eventMonth}
                           min={1}
                           max={12}
                           onChange={event => this.setState({ eventMonth: event.target.value })}
                           className="textctrl"/>
                  </div>
                </div>
                
                <div className="field-gr dd">
                  <h6>Day</h6>
                  <div className="val">
                    <input type="number" value={this.state.eventDay}
                           min={1}
                           max={31}
                           onChange={event => this.setState({ eventDay: event.target.value })} className="textctrl"/>
                  </div>
                </div>
                
                <div className="field-gr yy">
                  <h6>Year</h6>
                  <div className="val">
                    <input type="number" value={this.state.eventYear}
                           min={1000}
                           max={3000}
                           onChange={event => this.setState({ eventYear: event.target.value })} className="textctrl"/>
                  </div>
                </div>
              </div>
              
              <div className="fieldset">
                <h6>Event</h6>
                <div className="val">
                  <select className="selectctrl"
                          value={this.state.eventSelected}
                          onChange={e => this.setState({ eventSelected: e.target.value })}>
                    <option value={0}>-Select-</option>
                    {$p.eventTypes && $p.eventTypes.length > 0 && $p.eventTypes.map(e =>
                      <option key={`event-${e.name}`} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="actions fx">
                <a className="btn btn-clear"
                   onClick={this.hideAllPopup}
                >Cancel</a>
                <a className="btn"
                   onClick={this.onAddEvent}>
                  Add Event</a>
              </div>
            </form>
          </div>
        </div>
        
        <div className={"popup-wrap " + (this.state.popupActive === 'isTestimonialPop' ? 'on' : '')}
             onClick={this.hideAllPopup}
             ref={node => { this.nodeStory = node; }}>
          <div className="popup"
               onClick={this.stopPropagation}
          >
            <header className="type-testimony">Write Testimonial</header>
            <a className="close"
               onClick={this.hideAllPopup}
            > </a>
            <form className="frm">
              <div className="fieldset">
                <h6>Title</h6>
                <div className="val">
                  <input type="text"
                         value={this.state.testimonialTitle}
                         onChange={event => this.setState({ testimonialTitle: event.target.value })}
                         className="textctrl"/>
                </div>
              </div>
              <div className="fieldset">
                <h6>Testimonial</h6>
                <div className="val">
                  <textarea className="textarea textctrl"
                            value={this.state.testimonialContent}
                            onChange={event => this.setState({ testimonialContent: event.target.value })}
                  />
                </div>
              </div>
              <div className="actions fx">
                <a className="btn btn-clear"
                   onClick={this.hideAllPopup}
                >Cancel</a>
                <a className="btn btn-md"
                   onClick={this.onAddTestimonial}
                >Post Testimonial</a>
              </div>
            </form>
          </div>
        </div>
        
        <div className={"popup-wrap " + (this.state.popupActive === 'isBadgePop' ? 'on' : '')}
             onClick={this.hideAllPopup}
             ref={node => { this.nodeStory = node; }}>
          <div className="popup"
               onClick={this.stopPropagation}
          >
            <header className="type-badge">Add Badge</header>
            <a className="close"
               onClick={this.hideAllPopup}
            > </a>
            <form className="frm frm-badge">
              <div className="fieldset">
                <h6>Select Badge</h6>
                <div className="val">
                  <div className="badge-list-wrap">
                    <Scrollbars className="custom-scrollar scrollbar-md">
                      <div className="badge-list">
                        {!!$p.badges && $p.badges.map((item, i) => {
                          return (
                            <a key={i}
                               className={"badge-el " + item[ 'iconURL' ] + (!!this.state.badgeSelected[ item.id ] ? ' on' : '')}
                               onClick={() => {this.toggleBadgeSelect(item.id)}}
                            >{item.name}</a>
                          )
                        })}
                      </div>
                    </Scrollbars>
                  </div>
                </div>
              </div>
              
              <div className="actions fx">
                <a className="btn btn-clear"
                   onClick={this.hideAllPopup}
                >Cancel</a>
                <a className="btn"
                   onClick={this.onAddBadge}
                >Add Badge</a>
              </div>
            </form>
          </div>
        </div>
        
        <div className={"popup-wrap " + (this.state.popupActive === 'isNokPopup' ? 'on' : '')}
             onClick={this.hideAllPopup}
             ref={node => { this.nodeStory = node; }}>
          <div className="popup"
               onClick={this.stopPropagation}
          >
            <header>Send a Next of Kin Request (NOK)</header>
            <a className="close"
               onClick={this.hideAllPopup}
            > </a>
            <form className="frm">
              <div className="fieldset">
                <h6>Veteran name</h6>
                <div className="val">
                  <div className="textctrl disabled">{$p.profileName}</div>
                </div>
              </div>
              <div className="fieldset">
                <h6>Full Name <span className="required">(Required)</span></h6>
                <div className="val">
                  <input type="text" className={"textctrl " + (!!this.state.nokError.nokFullName ? 'error' : '')}
                         ref="nokFullName"
                         onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="fieldset">
                <h6>Your Email <span className="required">(Required)</span></h6>
                <div className="val">
                  <input type="email" className={"textctrl " + (!!this.state.nokError.nokEmail ? 'error' : '')}
                         ref="nokEmail"
                         onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="fieldset">
                <h6>Submit Proof</h6>
                <div className="val">
                  <Dropzone className="dropzone inline" onDrop={this.onDrop.bind(this)}>
                    <div className="drop-con">
                      <span className="filelist">{
                        this.state.files.length > 0
                          ? this.state.files.map(f => <span key={f.name} className="filename">{f.name}</span>)
                          : 'Upload file(s)'
                      }</span>
                      
                      <a className="btn btn-browse">Browse</a>
                    </div>
                  
                  </Dropzone>
                
                </div>
              </div>
              
              <div className="banner-accepted">
                <h4>Accepted Proof</h4>
                <div className="info">{$p.acceptedProof}</div>
              </div>
              
              <div className="actions fx">
                <a className="btn btn-clear"
                   onClick={this.hideAllPopup}
                >Cancel</a>
                <a className="btn"
                   onClick={this.sendRequest}
                >Send Request</a>
              </div>
            </form>
          </div>
        </div>
        
        <div className={"popup-wrap " + (this.state.popupActive === 'isThanksPop' ? 'on' : '')}
             onClick={this.hideAllPopup}
             ref={node => { this.nodeStory = node; }}>
          <div className="popup popup-thanks"
               onClick={this.stopPropagation}
          >
            <div className="msg-thanks">
              <h3>Thank You!</h3>
              <p className="msg-text">Your post will be reviewed.</p>
              <div className="action">
                <a className="btn"
                   onClick={this.hideAllPopup}
                >OK</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    
    )
  }
}

ProfileCard.propTypes = {
  attr: PropTypes.object,
  onAddEvent: PropTypes.func,
  onAddTestimonial: PropTypes.func,
  onUploadPhoto: PropTypes.func,
  onAddStory: PropTypes.func,
  onAddBadge: PropTypes.func,
  onAddNOK: PropTypes.func,
  onAddFlag: PropTypes.func,
};

export default ProfileCard;

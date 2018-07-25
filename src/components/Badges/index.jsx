import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './styles.scss';
import CommonService from "../../services/common";
import APIService from "../../services/api";
import {NavLink} from 'react-router-dom';

class Badges extends Component {
  constructor(props) {
    super(props);
    this.setActiveBadge = this.setActiveBadge.bind(this);
    this.clearActiveBadge = this.clearActiveBadge.bind(this);
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.setBadgeNextPrevIndex = this.setBadgeNextPrevIndex.bind(this);
    this.updatePopupActive = this.updatePopupActive.bind(this);
    this.state = {
      activeBadge: '',
      prevBadge: '',
      nextBadge: '',
      saluted: false,
    };
    this.type = 'Badge';
  }

  setActiveBadge(index) {
    // Re-fetch the individual badge to increment the post views counter
    this.props.fetchBadge(index).then(() => {
      this.setState({
        saluted: false,
      });
      return APIService.isSaluted(this.type, this.props.badges[index].id)
    }).then((rsp) => {
      this.setState({ saluted: rsp.saluted });
      this.setBadgeNextPrevIndex(index, this.props.badges.length);
    }).catch(err => CommonService.showError(err));
  }

  /**
   * salute post
   */
  salutePost() {
    APIService.salutePost(this.type, this.state.activeBadge.id).then(() => {
      const badge = this.state.activeBadge;
      badge.saluteCount = parseInt(badge.shareCount, 10) + 1;
      this.setState({
        activeBadge: badge,
        saluted: true
      });
      CommonService.showSuccess(`${this.type} saluted successfully`);
    }).catch(err => CommonService.showError(err));
  }

  /**
   * share post
   */
  sharePost() {
    APIService.sharePost(this.type, this.state.activeBadge.id).then(() => {
      const badge = this.state.activeBadge;
      badge.shareCount = parseInt(badge.shareCount, 10) + 1;
      this.setState({
        activeBadge: badge
      });
      CommonService.showSuccess(`${this.type} shared successfully`);
    }).catch(err => CommonService.showError(err));
  }

  clearActiveBadge() {
    this.setState({
      activeBadge: ''
    });
  }

  next() {
    const len = this.props.badges.length;
    let newIndex = !!this.state.activeSlideIndex ? this.state.activeSlideIndex : 0;
    newIndex += 1;
    newIndex = Math.min(newIndex, len - 1);
    this.setActiveBadge(newIndex);
  }

  prev() {
    let newIndex = !!this.state.activeSlideIndex ? this.state.activeSlideIndex : 0;
    newIndex -= 1;
    newIndex = Math.max(newIndex, 0);
    this.setActiveBadge(newIndex);
  }

  setBadgeNextPrevIndex(newIndex, len) {
    const prevIndex = Math.max(newIndex - 1, 0);
    const nextIndex = Math.min(newIndex + 1, len - 1);
    this.setState({
      activeBadge: this.props.badges[ newIndex ],
      activeSlideIndex: newIndex,
      prevBadge: this.props.badges[ prevIndex ],
      nextBadge: this.props.badges[ nextIndex ]
    });
  }

  updatePopupActive() {
    this.props.onPopupActive('isBadgePop');
  }

  render() {
    const { profileName, badges } = this.props;
    const activeBadge = this.state.activeBadge;

    return (
      <div className="collection-list-wrap collection-badges">
        <h3 className="title">Badges for {profileName}</h3>
        <span className="opts">
          <NavLink className="btn btn-rt-2 btn-search" to="/search"> </NavLink>
          <a className="btn btn-badge btn-rt-1" onClick={this.updatePopupActive}><span className="tx">Add Badge</span> </a>
        </span>

        {!activeBadge
          ? (
            <div>
              <div className="viewport bd-collection-view">
                {badges.map((item, i) => {
                  return (
                    <div key={i} className="bd-collection-item-card-wrap">
                      <div className="collection-item-card con-centered  con-badge"
                           onClick={() => { this.setActiveBadge(i) }}>
                        <div className="desc desc-md">
                          <figure className={"fig-badge " + item.badgeType.iconURL}/>
                        </div>
                        <h5>{item.badgeType.name}</h5>
                      </div>
                      <div className="caption">Badge from <strong>{item.createdBy.username}</strong></div>
                      <div className="date">{CommonService.getCreateTime(item)}</div>
                    </div>
                  )
                })
                }
              </div>
              {
                (this.props.total && this.props.items && this.props.items.length < this.props.total) ?
                  <div className="action">
                    <a className="btn btn-more"
                       onClick={() => this.props.fetchBadges(this.props.offset + this.props.limit)}>Load More
                      Badges</a>
                  </div>
                  : <div className={"space"}/>
              }
            </div>
          )
          : (
            <div className="viewport fullstory-view">
              <div className="fullstory-slide">
                <div className="fullstory-card fullstory-card-md alt">
                  <div className="postedby">Badge from <strong>{activeBadge.createdBy.username}</strong>
                    <span className="hide-md">and <a>5 other people</a></span></div>
                  <div className="dateval">{CommonService.getCreateTime(activeBadge)}</div>
                  <a className="close"
                     onClick={this.clearActiveBadge}
                  > </a>
                  <a className="flag" onClick={() => window.showProfileFlagPopUp('Badge', activeBadge.id)}>{''}</a>
                  <article className="article centered article-badges">
                    <h3 className="show-md">{activeBadge.title}</h3>
                    <div className="fullstory">
                      <figure className={"fig-badge bdg-md " + activeBadge.badgeType.iconURL}></figure>
                    </div>
                    <h3 className="hide-md">{activeBadge.badgeType.name}</h3>
                    <footer className="article-footer alt">
                      <div className="col col-meta">
                        <div className="meta-gr">
                          <h6>Views</h6>
                          <div className="meta-val reads">
                            {activeBadge.viewCount}
                          </div>
                        </div>
                        <div className="meta-gr">
                          <h6>Salutes</h6>
                          <div className="meta-val salutes">
                            {activeBadge.saluteCount}
                          </div>
                        </div>
                        <div className="meta-gr">
                          <h6>Shares</h6>
                          <div className="meta-val shares">
                            {activeBadge.shareCount}
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <a className={`btn btn-salute2 ${this.state.saluted ? ' disabled' : ''}`}
                           onClick={() => this.state.saluted ? null : this.salutePost()}
                           disabled={this.state.saluted}>Salute{this.state.saluted ? 'd' : ''}</a>
                        <a className="btn btn-share" onClick={() => this.sharePost()}>Share</a>
                      </div>
                    </footer>
                    {!!this.state.activeSlideIndex > 0
                    && (<a className="slide-arrow prev"
                           onClick={this.prev}
                    > </a>)
                    }
                    {this.state.activeSlideIndex < this.props.badges.length - 1
                    && (<a className="slide-arrow next"
                           onClick={this.next}
                    > </a>)
                    }
                  </article>
                </div>
              </div>
              <div className="fullstory-navs fullstory-navs-md">
                <div className="col">
                  {this.state.activeSlideIndex > 0
                  &&
                  (<div><h5><a onClick={this.prev} className="prev">Previous Badge</a></h5>
                    <h4><a onClick={this.prev}>{this.state.prevBadge.badgeType.name}</a></h4></div>)
                  }
                </div>
                <div className="col col-btn show-md">
                  <div className="action"><a className="btn btn-more btn-md">Load More Badges</a></div>
                </div>
                <div className="col">
                  {this.state.activeSlideIndex < this.props.badges.length - 1
                  &&
                  (<div><h5><a onClick={this.next} className="next">Next Badge</a></h5>
                    <h4><a onClick={this.next}>{this.state.nextBadge.badgeType.name}</a></h4></div>)
                  }
                </div>
              </div>
            </div>
          )
        }
      </div>
    )
  }
}

Badges.propTypes = {
  prop: PropTypes.object
};

export default Badges;

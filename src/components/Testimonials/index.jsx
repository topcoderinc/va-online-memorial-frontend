import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './styles.scss';
import CommonService from "../../services/common";
import APIService from "../../services/api";
import {NavLink} from 'react-router-dom';

class Testimonials extends Component {
  constructor(props) {
    super(props);
    this.setActiveTestimonial = this.setActiveTestimonial.bind(this);
    this.clearActiveTestimonial = this.clearActiveTestimonial.bind(this);
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.setTestNextPrevIndex = this.setTestNextPrevIndex.bind(this);
    this.updatePopupActive = this.updatePopupActive.bind(this);

    this.state = {
      activeTestimonial: '',
      prevTestimonial: '',
      nextTestimonial: '',
      saluted: false,
    };
    this.type = 'Testimonial';
  }

  setActiveTestimonial(index) {
    // Re-fetch the individual testimonial to increment the post views counter
    this.props.fetchTestimonial(index).then(() => {
      this.setState({
        saluted: false,
      });
      return APIService.isSaluted(this.type, this.props.testimonials[index].id)
    }).then((rsp) => {
      this.setState({ saluted: rsp.saluted });
      this.setTestNextPrevIndex(index, this.props.testimonials.length);
    }).catch(err => CommonService.showError(err));
  }

  /**
   * salute post
   */
  salutePost() {
    APIService.salutePost(this.type, this.state.activeTestimonial.id).then(() => {
      const testimonial = this.state.activeTestimonial;
      testimonial.saluteCount = parseInt(testimonial.shareCount, 10) + 1;
      this.setState({
        activeTestimonial: testimonial,
        saluted: true
      });
      CommonService.showSuccess(`${this.type} saluted successfully`);
    }).catch(err => CommonService.showError(err));
  }

  /**
   * share post
   */
  sharePost() {
    APIService.sharePost(this.type, this.state.activeTestimonial.id).then(() => {
      const testimonial = this.state.activeTestimonial;
      testimonial.shareCount = parseInt(testimonial.shareCount, 10) + 1;
      this.setState({
        activeTestimonial: testimonial
      });
      CommonService.showSuccess(`${this.type} shared successfully`);
    }).catch(err => CommonService.showError(err));
  }

  clearActiveTestimonial() {
    this.setState({
      activeTestimonial: ''
    });
  }

  next() {
    const len = this.props.testimonials.length;
    let newIndex = !!this.state.activeSlideIndex ? this.state.activeSlideIndex : 0;
    newIndex += 1;
    newIndex = Math.min(newIndex, len - 1);
    this.setActiveTestimonial(newIndex);
  }

  prev() {
    let newIndex = !!this.state.activeSlideIndex ? this.state.activeSlideIndex : 0;
    newIndex -= 1;
    newIndex = Math.max(newIndex, 0);
    this.setActiveTestimonial(newIndex);
  }

  setTestNextPrevIndex(newIndex, len) {
    const prevIndex = Math.max(newIndex - 1, 0);
    const nextIndex = Math.min(newIndex + 1, len - 1);
    this.setState({
      activeTestimonial: this.props.testimonials[ newIndex ],
      activeSlideIndex: newIndex,
      prevTestimonial: this.props.testimonials[ prevIndex ],
      nextTestimonial: this.props.testimonials[ nextIndex ]
    });
  }

  updatePopupActive() {
    this.props.onPopupActive('isTestimonialPop');
  }

  render() {
    const { profileName, testimonials } = this.props;
    const activeTestimonial = this.state.activeTestimonial;

    return (
      <div className="collection-list-wrap">
        <h3 className="title">Testimonials for {profileName}</h3>
        <span className="opts">
          <NavLink className="btn btn-rt-2 btn-search" to="/search"> </NavLink>
          <a className="btn btn-rt-1 btn-test" onClick={this.updatePopupActive}><span className="tx"><span
            className="show-md">Write</span> Testimonial</span> </a>
        </span>


        {!activeTestimonial
          ? (
            <div>
              <div className="viewport tt-collection-view">
                {testimonials.map((item, i) => {
                  return (
                    <div key={i} className="tt-collection-item-card-wrap">
                      <div className="collection-item-card  con-centered">
                        <h5>{item.title}</h5>
                        <div className="desc">{item.text}</div>
                        <div className="more"
                             onClick={() => { this.setActiveTestimonial(i) }}
                        ><a>Read more</a></div>
                      </div>
                      <div className="caption">Testimonial by <strong>{item.createdBy.username}</strong></div>
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
                       onClick={() => this.props.fetchTestimonials(this.props.offset + this.props.limit)}>Load More
                      Testimonials</a>
                  </div>
                  : <div className={"space"}/>
              }
            </div>
          )
          : (
            <div className="viewport fullstory-view">
              <div className="fullstory-slide">
                <div className="fullstory-card fullstory-card-md">
                  <div className="postedby">Testimonials by <strong>{activeTestimonial.createdBy.username}</strong></div>
                  <div className="dateval">{CommonService.getCreateTime(activeTestimonial)}</div>
                  <a className="close"
                     onClick={this.clearActiveTest}
                  > </a>
                  <a className="flag" onClick={() => window.showProfileFlagPopUp('Testimonial', activeTestimonial.id)}>{''}</a>

                  <article className="article centered">
                    <h3>{activeTestimonial.title}</h3>
                    <div className="fullstory"
                         dangerouslySetInnerHTML={{ __html: activeTestimonial.text }}
                    />

                    <footer className="article-footer alt">
                      <div className="col col-meta">
                        <div className="meta-gr">
                          <h6>Views</h6>
                          <div className="meta-val reads">
                            {activeTestimonial.viewCount}
                          </div>
                        </div>
                        <div className="meta-gr">
                          <h6>Salutes</h6>
                          <div className="meta-val salutes">
                            {activeTestimonial.saluteCount}
                          </div>
                        </div>
                        <div className="meta-gr">
                          <h6>Shares</h6>
                          <div className="meta-val shares">
                            {activeTestimonial.shareCount}
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
                    {this.state.activeSlideIndex < this.props.testimonials.length - 1
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
                  (<div><h5><a onClick={this.prev} className="prev">Previous Testimonial</a></h5>
                    <h4><a onClick={this.prev}>{this.state.prevPhoto.title}</a></h4></div>)
                  }
                </div>
                <div className="col col-btn show-md">
                  <div className="action"><a className="btn btn-more btn-md">Load More Testimonials</a></div>
                </div>
                <div className="col">
                  {this.state.activeSlideIndex < this.props.testimonials.length - 1
                  &&
                  (<div><h5><a onClick={this.next} className="next">Next Testimonial</a></h5>
                    <h4><a onClick={this.next}>{this.state.nextPhoto.title}</a></h4></div>)
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

Testimonials.propTypes = {
  prop: PropTypes.object
};

export default Testimonials;

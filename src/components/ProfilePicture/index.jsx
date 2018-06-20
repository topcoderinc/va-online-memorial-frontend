import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './profile-picture.scss';

class ProfilePicture extends Component {
  static placeholderImage = '/profile-pic-placeholder.svg';
  static defaultProps = {
    height: 300,
    width: 300,
  };

  profileImage() {
    if (this.props.imageSrc === undefined || this.props.imageSrc === null) {
      return ProfilePicture.placeholderImage;
    } else {
      return this.props.imageSrc;
    }
  }

  render() {
    const { children, height, imageAlt, width } = this.props;

    return (
      <div className="profile-picture">
        <img src={this.profileImage()} alt={imageAlt} height={height} width={width} />
        {children}
      </div>
    );
  }
}

ProfilePicture.propTypes = {
  height: PropTypes.number,
  imageAlt: PropTypes.string,
  imageSrc: PropTypes.string,
  width: PropTypes.number,
};

export default ProfilePicture;

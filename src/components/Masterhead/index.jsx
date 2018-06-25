import React from 'react';
import {NavLink} from 'react-router-dom';
import './styles.scss';

const MainHeader = ({ props }) => {
  return (
    <div className="master-head">
      <h2>{props.title}</h2>
      <div className="info">{props.info}</div>
      <div className="actions">
        <NavLink className="btn" to="/search">Find a Veteran</NavLink>
      </div>
    </div>
  );
};

export default MainHeader;

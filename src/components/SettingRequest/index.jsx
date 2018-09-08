import React from 'react';
import {get} from 'lodash';
import Dropzone from 'react-dropzone';
import {DEFAULT_PROFILE_DATA} from '../../config';
import CommonService from "../../services/common";

import './setting-request.scss';

const phases = ['Submitted', 'In Review', 'Approved'];
const status = ['Submitted', 'Requested', 'Approved'];

class SettingRequest extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      files: [],
      showProof: [],
      veteranId: '',
    };
    this.deleteNokRequest = this.deleteNokRequest.bind(this);
    this.createNokRequest = this.createNokRequest.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
  }

  onDrop = files => {
    this.setState({files});
  };

  onChange(value) {
    this.setState({ veteranId: value });
  }

  createNokRequest() {
    const { veteranId, files } = this.state;
    const veteranIsNotSelected = veteranId === '';
    const nofilesUploaded = files.length === 0;
    if (veteranIsNotSelected) {
      CommonService.showError('Please select a Veteran Name');
    }

    if (nofilesUploaded) {
      CommonService.showError('Please upload a file');
    }

    if (veteranIsNotSelected || nofilesUploaded) return;

    this.props.createNokRequest(files, veteranId, () => {
      this.setState({veteranId: '', files: []})
    });
  }

  deleteNokRequest(id) {
    this.props.deleteNokRequest(id);
  }

  downloadFile(file) {
    this.props.downloadFile(file);
  }

  toggleProof = i=>{
    const {showProof} = this.state;
    showProof[i] = !showProof[i];
    this.setState({
      showProof: showProof,
    })
  };

  render(){
    const {veterans, submitted} = this.props;
    return (
      <div className="setting-request">
        <h2 className="request-title">Send new Next of Kin Request</h2>
        <div className="fieldset">
          <div className="request-label">Veteran Name</div>
          <select className="selectctrl request-input" value={this.state.veteranId} onChange={(event) => this.onChange(event.target.value)}>
            <option value=''></option>
            {
              veterans.map((v,i)=>(
                <option key={i} value={v.id}>{`${v.firstName} ${v.midName} ${v.lastName}`}</option>
              ))
            }
          </select>
        </div>
        <div className="fieldset">
          <div className="request-label">Submit Proof</div>
          <div className="val">
            <Dropzone className="dropzone inline" onDrop={this.onDrop}>
              <div className="drop-con">
                <div className="show-md full-wd">
                  <span className="filelist">{
                    this.state.files.length>0
                      ? this.state.files.map(f => <span key={f.name} className="filename">{f.name}</span>)
                    : ''
                  }</span>
                </div>
                <div className="hide-md full-wd">
                  <span className="filelist">{
                    this.state.files.length>0
                      ? this.state.files.map(f => <span key={f.name} className="filename">{f.name}</span>)
                    : ''
                  }</span>
                </div>
                <a className="btn btn-browse">Browse</a>
              </div>
            </Dropzone>
          </div>
        </div>
        <div className="banner-accepted">
          <h4>Accepted Proof</h4>
          <div className="info">{DEFAULT_PROFILE_DATA.acceptedProof}</div>
        </div>
        <div className="request-actions">
          <a className="btn" onClick={this.createNokRequest}>Send Request</a>
        </div>
        <h2 className="request-title second-title">Submitted Request</h2>
        {
          submitted.map((s,i)=>(
            <div key={i} className="request-submitted">
              <img src={s.image || '/rp3.png'} alt=""/>
              <div className="submitted-name">{`${s.veteran.firstName} ${s.veteran.midName} ${s.veteran.lastName}`}</div>
              <div className="submitted-birth-and-death">{`${new Date(s.veteran[ 'birthDate' ]).getFullYear()} - ${new Date(s.veteran[ 'deathDate' ]).getFullYear()}`}</div>
              <div>You'll receive a notification once your request are reviewed</div>
              <div className="submitted-progress">
                <div className="progress-base">
                  {
                    phases.map((p,j)=>(
                      j>0 &&
                      <div key={j} className={`progress-bar ${status.indexOf(s.status) >= j ? 'passed' : ''}` }></div>
                    ))
                  }
                </div>
                <div className="progress-points">
                  {
                    phases.map((p,j)=>(
                      <div key={j} className={`progress-point ${status.indexOf(s.status) >= j ? 'passed' : ''}`} style={{left: (j / (phases.length - 1) * 100) + '%'}}>
                        <span className="progress-dot"></span>
                        <div className="progress-label">{p}</div>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className="submitted-actions">
                <a className="btn" onClick={()=>this.toggleProof(i)}>{this.state.showProof[i] ? 'Hide' : 'View' } Submitted Proof</a>
                <a className="btn btn-delete" onClick={() => this.deleteNokRequest(s.id)}> </a>
              </div>
              {
                this.state.showProof[i] &&
                (
                  <div className="submitted-proof">
                    <div className="proof-head">
                      <span>Submitted Proof</span>
                    </div>
                    {
                      get(s, 'proofs', []).map((p, j)=>(
                        <div key={j} className="proof-item">
                          <a onClick={() => this.downloadFile(p)}>{p.name}</a>
                          <a className="btn" onClick={() => this.downloadFile(p)}>Download</a>
                        </div>
                      ))
                    }
                  </div>
                )
              }
            </div>
          ))
        }
      </div>
    )
  }
}

SettingRequest.defaultProps = {
  veterans: [],
  submitted: [],
};

export default SettingRequest;

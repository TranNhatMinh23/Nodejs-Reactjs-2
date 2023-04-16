/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/href-no-hash */
import React from "react";
import {
  Row,
  Col,
  FormGroup,
  Input,
  FormFeedback,
  // Form,
  Label
} from "reactstrap";
import { _urlImageOrigin } from "../../config/utils";
import { connect } from "react-redux";
import {
  CustomForm,
  UpdatePlan
} from "../../components";
import { updateEntertainerTypes } from "../../actions/entertainer_type";
import { updateLoading } from "../../actions/loading";
import { ProgressProfile } from './index';
import { getCompletedSteps, setCompletedStep } from "../../actions/progress_profile";
import internalApi from "../../config/internalApi";
import {
  Icon,
  Modal,
  message,
  Upload,
  Button,
  Tooltip
} from "antd";
import { updateAuth } from "../../actions/auth";
import { totalPhotoRequired, totalVideoURLRequired } from '../../config/constant'

class Profile extends CustomForm {
  constructor(props) {
    super(props);
    this.state = {
      errUrl: false,
      total_rows_prices: 1,
      total_rows_locations: 1,
      avatar: null,
      act_background: null,
      imageList: [],
      videoList: [],
      isPreviewImage: false,
      isPreviewVideo: false,
      previewImage: "",
      charge_per_mile: props.auth && props.auth.charge_per_mile ? props.auth.charge_per_mile : "",
      form: {
        first_name: {
          value: props.auth.user_id.first_name,
          isTouched: false
        },
        last_name: {
          value: props.auth.user_id.last_name,
          isTouched: false
        },
        phone: props.auth.user_id.phone || '',
        email: props.auth.user_id.email,
        act_location: {
          value: props.auth.act_location,
          isTouched: false
        },
        video_links: props.auth.video_links,
        act_name: props.auth.act_name || "",
        act_description: props.auth.act_description || "",
        act_tags: props.auth.act_tags || "",
        act_type_id: props.auth.act_type_id
          ? typeof props.auth.act_type_id === "object" ||
            props.auth.act_type_id instanceof Object
            ? props.auth.act_type_id._id
            : props.auth.act_type_id
          : "",
        photos: props.auth.photos,
        videos: props.auth.videos,
        deleted_photos: [],
        deleted_videos: [],
        act_background:
          props.auth.packages && props.auth.packages.length > 0
            ? props.auth.packages
            : "",
        locations_covered:
          props.auth.locations_covered &&
            props.auth.locations_covered.length > 0
            ? props.auth.locations_covered
            : [],
        address: props.auth.user_id.address || "",
      },
      location: null
    };
  }

  componentDidMount() {
    this.props.updateEntertainerTypes();
  }

  componentWillReceiveProps(props) {
    if (
      props.entertainer_types &&
      props.entertainer_types.length > 0 &&
      this.state.form.act_type_id.length < 1
    ) {
      this.setState({
        form: {
          ...this.state.form,
          act_type_id: props.entertainer_types[0]._id
        }
      });
    }
    if (props.auth && props.auth.photos && props.auth.photos.length > 0) {
      const data = props.auth.photos.map((item, index) => {
        return {
          uid: index,
          name: item,
          status: 'done',
          url: _urlImageOrigin(item),
        }
      })
      this.setState({ imageList: data });
    }
  }

  checkExsitSocial = (s, array = []) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].name === s) {
        return true;
      }
    }
    return false;
  };

  addAnotherInput = type => {
    let form = this.state.form;
    if (type === "packages") {
      form[type] = [
        ...form[type],
        {
          name: "",
          description: "",
          price: null
        }
      ];
    }
    if (type === "locations_covered") {
      form[type] = [
        ...form[type],
        {
          label: "",
          lat: null,
          lng: null
        }
      ];
    }
    this.setState({
      form
    });
  };


  onSelectBackground = e => {
    if (e.target.files[0]) {
      this.setState({
        act_background: e.target.files[0]
      });
    }
  };

  onSubmit = () => {
    if (this.validateRequired()) {
      let data = this.getValue(["photos", "videos", "video_links"]);
      let datas = new FormData();
      data["locations_covered"] = data.locations_covered.filter(
        s => s.label.length > 0
      );
      let video_links = this.state.form.video_links;

      for (let i = 0; i < video_links.length; i++) {
        // eslint-disable-next-line no-useless-escape
        const Regex = /(http:|https:|)\/\/(player.|www.|m.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/
        if (!video_links[i].match(Regex)) {
          this.setState({
            errUrl: true,
          })
          return;
        }
      }
      Object.keys(data).forEach(k => {
        if (k !== "packages") {
          if (
            k === "locations_covered" ||
            k === "social" ||
            k === "photos" ||
            k === "videos" ||
            k === "deleted_photos" ||
            k === "videos"
          ) {
            datas.append(k, JSON.stringify(data[k]));
          } else {
            datas.append(k, data[k]);
          }
        }
      });
      if (this.state.act_background) {
        datas.append("act_background", this.state.act_background);
      }
      if (this.state.avatar) {
        datas.append("avatar", this.state.avatar);
      }

      if (this.state.location) {
        datas.append("location_long", this.state.location.lng);
        datas.append("location_lat", this.state.location.lat);
      }

      const entertainer_id = this.props.auth._id;
      for (let i = 0; i < this.state.imageList.length; i++) {
        if (!this.state.imageList[i].originFileObj) continue;
        datas.append("photos", this.state.imageList[i].originFileObj);
      }
      for (let i = 0; i < this.state.videoList.length; i++) {
        datas.append("videos", this.state.videoList[i].originFileObj);
      }
      datas.append("video_links", JSON.stringify(this.state.form.video_links.filter(v => v.length > 0)));
      datas.append("charge_per_mile", this.state.charge_per_mile);
      internalApi
        .put(`entertainers/${entertainer_id}`, datas)
        .then(res => {
          this.props.updateLoading(false);
          if (res.success) {
            message.success('Successfully updated');
            const data = {
              id: entertainer_id,
              alias: "BiographyMedia",
            }

            this.props.setCompletedStep(data);
            this.props.updateAuth(res.data);
            setTimeout(() => {
              this.props.getCompletedSteps(entertainer_id);
            }, 300);
          } else {
            message.error(res.data.message || '');
          }
        })
        .catch(err => {
          message.error(err.response.data.message);
          this.props.updateLoading(false);
        });
    } else {
      message.error('Invalid Data, please check again!');
    }
  };

  handleCancelImage = () =>
    this.setState({ isPreviewImage: false, previewImage: "" });

  handlePreviewImage = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      isPreviewImage: true
    });
  };
  onRemove = file => {
    let form = this.state.form;
    let deleted_photos = this.state.form.deleted_photos;
    if (file.name) {
      deleted_photos.push(file.name);
      this.setState({
        form: {
          ...form,
          deleted_photos
        }
      });
    }
  }
  handleChangeImage = ({ fileList }) => {
    this.setState({ imageList: fileList });
  };

  beforeUploadImage = (file, filelist) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      this.setState({
        imageList: filelist.splice(filelist.length - 1, 1)
      });
      message.error("Image must smaller than 5MB!");
    }
    return false;
  };

  onChangeVideo = (value, index) => {
    let video_links = this.state.form.video_links;
    video_links[index] = value;
    this.setState({
      form: {
        ...this.state.form,
        video_links
      },
      errUrl: false
    });
  }

  onAddVideo = () => {
    let video_links = this.state.form.video_links;
    video_links.push('');
    this.setState({
      form: {
        ...this.state.form,
        video_links
      }
    });
  }

  onRemoveVideo = (index) => {
    let video_links = this.state.form.video_links;
    video_links.splice(index, 1);
    this.setState({
      form: {
        ...this.state.form,
        video_links
      }
    });
  }

  render() {
    const uploadButton = (
      <div>
        <Icon type="plus" />
      </div>
    );
    const tipPicture = `To publish your profile, you have to upload at least ${totalPhotoRequired} photos`
    const tipVideo = `To publish your profile, you have to add at least ${totalVideoURLRequired} video URL`
    return (
      <div className="dasdboard-content">
        <div className="profile-customer settings">
          <ProgressProfile tabName="" />
          <UpdatePlan />
          <div className="container">
            <div className="content">
              <div style={{ marginBottom: '0px' }} className="title">
                <Row className="book-now-title">
                  <Col>
                    <h3 style={{ marginTop: '0 !important' }}>Act Details</h3>
                    <h5>Enter the name of your act below followed by a brief description about who you are and the services you provide. </h5>
                  </Col>
                </Row>
              </div>

              <div className="personal-detail boxShadow pd-0">
                <div className="act-content">
                  <Row>
                    <Col sm={12}>
                      <FormGroup className="form-custom">
                        <Label style={{ fontSize: '16px' }}>Act Name</Label>
                        <Input
                          type="text"
                          name="act_name"
                          placeholder="Act Name"
                          className="input-custom"
                          value={this.state.form.act_name}
                          onChange={e =>
                            this.onChangeValue("act_name", e.target.value)
                          }
                        />
                      </FormGroup>
                      <FormGroup className="form-custom">
                        <Label style={{ fontSize: '16px', width: "100%" }}>Biography</Label>
                        <Input
                          type="textarea"
                          name="text"
                          placeholder="Tell us about your career so far"
                          className="input-custom"
                          rows="4"
                          value={this.state.form.act_description}
                          onChange={e =>
                            this.onChangeValue("act_description", e.target.value)
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="act-profile">
                    <div className="act-save">
                      <a className="btn-none" onClick={this.onSubmit}>
                        Save
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '0px' }} className="title">
                <h3>Media</h3>
                <h5>Share your photos and videos to show the world how amazing you are</h5>
              </div>

              <div className="personal-detail boxShadow">
                <p>Your uploaded photos (max 10)
                <Tooltip placement="bottomLeft" title={tipPicture}>
                    <Icon className="toolip_info" type="question-circle" />
                  </Tooltip>
                </p>
                <Row>
                  <Col sm={12}>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }} className="exist-photos">
                      <Upload
                        accept="image/*"
                        listType="picture-card"
                        fileList={this.state.imageList}
                        onPreview={this.handlePreviewImage}
                        onChange={this.handleChangeImage}
                        beforeUpload={this.beforeUploadImage}
                        onRemove={this.onRemove}
                        className="images-upload"
                      >
                        {this.state.imageList.length >=
                          10
                          ? null
                          : uploadButton}
                      </Upload>
                    </div>

                    <Modal
                      visible={this.state.isPreviewImage}
                      footer={null}
                      onCancel={this.handleCancelImage}
                    >
                      <img
                        alt="preview"
                        style={{ width: "100%" }}
                        src={this.state.previewImage}
                      />
                    </Modal>
                  </Col>
                  <Col sm={12} className="videos">
                    <p>Video URLs
                   {totalVideoURLRequired !== '0' && <Tooltip placement="bottomLeft" title={tipVideo}>
                        <Icon className="toolip_info" type="question-circle" />
                      </Tooltip>}
                    </p>
                    <FormFeedback style={{ display: (this.state.errUrl) ? 'block' : 'none', marginBottom: '10px' }}>Please input video URL from Youtube or Vimeo.</FormFeedback>
                    <div className="exist-video">
                      {
                        this.state.form.video_links.map((v, index) => {
                          return (
                            <FormGroup key={index} className="form-custom">
                              <Row form>
                                <Col>
                                  <Input
                                    type="text"
                                    name={`video_${index}`}
                                    className="input-custom"
                                    placeholder="Only YouTube and Vimeo links"
                                    value={v}
                                    onChange={e => this.onChangeVideo(e.target.value, index)}
                                  />
                                </Col>
                                <Col xs='auto'>
                                  <Button className="btn-remove" onClick={() => this.onRemoveVideo(index)}>Remove</Button>
                                </Col>
                              </Row>
                            </FormGroup>
                          )
                        })
                      }
                      {
                        this.state.form.video_links.length < 5 &&
                        <a style={{ color: '#05c4e1' }} onClick={() => this.onAddVideo()}>Add another video URL</a>
                      }
                    </div>
                  </Col>
                </Row>
                <div className="act-profile">
                  <div className="act-save">
                    <a className="btn-none" onClick={this.onSubmit}>
                      Save
                      </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    entertainer_types: state.entertainer_types.data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateEntertainerTypes: () => {
      dispatch(updateEntertainerTypes());
    },
    updateLoading: status => {
      dispatch(updateLoading(status));
    }, setCompletedStep: data => {
      dispatch(setCompletedStep(data));
    },
    getCompletedSteps: id => {
      dispatch(getCompletedSteps(id));
    },
    updateAuth: data => {
      dispatch(updateAuth(data));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);

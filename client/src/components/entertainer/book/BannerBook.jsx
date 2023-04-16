import React from "react";
import { Row, Col } from "antd";
import { Modal as ModalAnt } from "antd";
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { _url, _urlImage } from "../../../config/utils";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import internalApi from '../../../config/internalApi';
import { updateAuth } from '../../../actions/auth';
import { FacebookShareButton, TwitterShareButton, EmailShareButton } from 'react-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// import ReactImageVideoLightbox from "react-image-video-lightbox";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import NukaCarousel from 'nuka-carousel';
import ReactPlayer from 'react-player'
import { Icon } from 'antd';
import _ from 'lodash';
import { _store } from "index";
import { KEY_PERSIST_STORE } from "config";

class BannerBook extends React.Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            sliderSetting: {
                dots: true,
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: false,
                autoplaySpeed: 2000,
                pauseOnHover: true,
                isShowShare: false,
                arrows: false,
            },
            isViewPhoto: false
        }
    }

    isLogin = () => {
        const token =
            _store.getState().auth.remember ?
                _store.getState().auth.token :
                sessionStorage.getItem(`${KEY_PERSIST_STORE}-accessToken`)
        return !!token;
        // return this.props.auth.user_id && this.props.auth.user_id._id && this.props.auth.user_id._id.length > 0;
    }

    isCustomer = () => {
        return this.props.auth && this.props.auth.user_id && this.props.auth.user_id.role === 'CUSTOMER';
    };

    toggle() {
        this.setState({ isViewPhoto: false });
    }

    isFavourited = () => {
        if (!this.isCustomer()) {
            return false;
        }
        return this.props.auth.favourites.indexOf(this.props.match.params ? this.props.match.params.id || '' : '') > -1;
    };

    toggleFavourite = () => {
        internalApi.put(`customers/${this.props.auth._id}/toggleFavourites`, { ent_id: this.props.match.params.id }).then(res => {
            if (res.success) {
                this.props.updateAuth({
                    favourites: res.data.favourites
                });
            }
        });
    };

    renderSlider(images, video_links) {
        const imageLoading = {
            objectFit: 'cover',
            width: "100%",
            height: "360px"
        }
        const imagesToRender = this.props.finishedLoading ? images : []
        if (imagesToRender && imagesToRender.length === 0) {
            return (
                <Row>
                    <div style={imageLoading}>
                    </div>
                </Row>
                // <Carousel
                //     className="carousel-banner-booking"
                //     showThumbs={false}
                //     showStatus={false}
                //     infiniteLoop={false}
                //     showArrows={false}
                // >
                //     <div>
                //         <img alt="" src={_url("assets/images/book/banner-bg1.jpg")} />
                //     </div>
                //     <div>
                //         <img alt="" src={_url("assets/images/book/banner-bg2.jpg")} />
                //     </div>
                //     <div>
                //         <img alt="" src={_url("assets/images/book/banner-bg3.jpg")} />
                //     </div>
                //     <div>
                //         <img alt="" src={_url("assets/images/book/banner-bg4.jpg")} />
                //     </div>
                // </Carousel>
            )
        } else {
            return (
                <Carousel
                    className="carousel-banner-booking"
                    showThumbs={false}
                    showStatus={false}
                    infiniteLoop={true}
                    showArrows={true}
                    showIndicators={false}
                    emulateTouc={false}
                >
                    {imagesToRender.map((item, index) => {
                        return (
                            <div key={index} className='blur-background'>
                                <img alt="" src={item.url} />
                            </div>
                        )
                    })}
                    {video_links.length > 0 ? video_links.map((item, index) => {
                        return (
                            <ReactPlayer
                                controls={true}
                                className="custom-url-link"
                                data-url={`data-url-${index}`}
                                onError={(error) => {
                                    if (error.target) {
                                        const node = error.target.parentNode;
                                        node.innerHTML = `<a  href = "${item.url}" target= '_blank' style="color: #05c4e1; cursor: pointer;">${item.url.substring(0, 35)}....</a>`
                                    }
                                }}
                                // height={360}
                                width={360}
                                url={item.url}
                                key={index} >
                            </ReactPlayer>
                        )
                    }) : null}
                </Carousel>
            )
        }
    }

    renderPicture(images, videos) {
        return (
            <Modal size='lg' isOpen={this.state.isViewPhoto} toggle={this.toggle} className="modal-picture">
                <ModalHeader toggle={this.toggle}>View photos and videos</ModalHeader>
                <ModalBody>
                    <NukaCarousel width='100%'>
                        {
                            videos && videos.length > 0 && videos.map((item, index) => (
                                <ReactPlayer
                                    controls={true}
                                    className="custom-url-link"
                                    data-url={`data-url-${index}`}
                                    onError={(error) => {
                                        if (error.target) {
                                            const node = error.target.parentNode;
                                            node.innerHTML = `<a  href = "${item.url}" target= '_blank' style="color: #05c4e1; cursor: pointer;">${item.url.substring(0, 35)}....</a>`
                                        }
                                    }}
                                    url={item.url}
                                    key={index} >
                                </ReactPlayer>
                            ))
                        }
                        {
                            images && images.length > 0 && images.map((item, index) => (
                                <div key={index} >
                                    <img src={item.url} alt="" />
                                </div>
                            ))
                        }
                    </NukaCarousel>
                </ModalBody>
            </Modal>
        )
    }

    renderShare(path, name) {
        return (
            <ModalAnt
                centered
                visible={this.state.isShowShare}
                onCancel={() => this.setState({ isShowShare: false })}
                footer={null}
            >
                <div className="share_social">
                    <h3>Share</h3>
                    <p>Please check out {name} profile!</p>
                    <FacebookShareButton
                        url={path}
                        quote="Book me on Talent Town:"
                    >
                        <p>
                            <img src={_url("assets/images/facebook2.png")} alt="" className="favourite-icon" />
                            Facebook
                        </p>
                    </FacebookShareButton>
                    <TwitterShareButton
                        url={path}
                        title={'Book me on Talent Town:'}
                    >
                        <p>
                            <img src={_url("assets/images/twitter2.png")} alt="" className="favourite-icon" />
                            Twitter
                        </p>
                    </TwitterShareButton>
                    <EmailShareButton
                        url={path}
                        subject={`Check ${name} on Talent Town`}
                        body={`Check ${name} on Talent Town: ${path}`}
                    >
                        <p>
                            <img src={_url("assets/images/mail.png")} alt="" className="favourite-icon" />
                            Email
                        </p>
                    </EmailShareButton>
                    {/* <p>
                        <img src={_url("assets/images/icon-mess.png")} alt="" className="favourite-icon"/>
                        Messenger
                    </p> */}
                    <CopyToClipboard
                        text={path}
                    >
                        <p>
                            <img src={_url("assets/images/web-link.png")} alt="" className="favourite-icon" />
                            Copy Link
                        </p>
                    </CopyToClipboard>
                </div>

            </ModalAnt>

        )
    }

    renderPhotos(perLeft) {
        return (
            <span>
                <a
                    onClick={() => this.setState({ isViewPhoto: true })}
                    className="btn-custom bg-blue text-color-white view-photo-with-text"
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        right: `${perLeft}%`,
                        display: "inline-block"
                    }}
                >
                    View photos & videos
                </a>
                {/* <a
                    onClick={() => this.setState({isViewPhoto: true})}
                    className="text-color-white view-photo-with-no-text"
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        right: `${perLeft}%`,
                        display: "none"
                    }}
                >
                    <img
                        src={_url("assets/images/instagram.png")}
                        alt=""
                        className="favourite-icon"
                    />
                </a> */}
            </span>
        )
    }


    renderFav(perLeft) {
        // const fromUrl = '/entertainers/' + this.props.entertainer._id;
        const styleDiv = {
            position: "absolute",
            top: "10px",
            zIndex: '10',
            right: `${perLeft}%`,
            display: "inline-flex",
            height: "44px"
        };
        const styles = {
            marginLeft: '10px',
            zIndex: '10',
            display: "inline-flex",
        };
        return (
            <div style={styleDiv}>
                <a
                    className="btn-custom bg-blue text-color-white share-icon-with-text"
                    style={{
                        display: "inline-block"
                    }}
                    onClick={() => {
                        this.setState({ isShowShare: true })
                    }}
                >
                    <img
                        src={_url("assets/images/share-1.svg")}
                        alt=""
                        className="favourite-icon wd24he22"
                    />
                    Share
                </a>
                <a
                    className="text-color-white share-icon-with-no-text"
                    style={{
                        display: "none"
                    }}
                    onClick={() => {
                        this.setState({ isShowShare: true })
                    }}
                >
                    <img
                        src={_url("assets/images/share-1.svg")}
                        alt=""
                        className="favourite-icon wd24he22"
                        height="25"
                    />
                </a>
                {
                    this.isLogin() && this.isCustomer() && (
                        this.isFavourited() ? (
                            <span style={{ marginLeft: "10px" }}>
                                <a
                                    className="btn-custom bg-blue text-color-white remove-icon-with-text"
                                    style={styles}
                                    onClick={this.toggleFavourite}
                                >
                                    <img
                                        src={_url("assets/images/favourite_heart_ok.svg")}
                                        alt=""
                                        className="favourite-icon wd24he24"
                                    />
                                    Remove
                                    </a>
                                <a
                                    className="remove-icon-with-no-text"
                                    style={{ display: "none" }}
                                    onClick={this.toggleFavourite}
                                >
                                    <img
                                        src={_url("assets/images/favourite_heart_ok.svg")}
                                        alt=""
                                        className="favourite-icon wd24he24"
                                    />
                                </a>
                            </span>
                        ) : (
                                <span style={{ marginLeft: "10px" }}>
                                    <a
                                        className="btn-custom bg-blue text-color-white add-icon-with-text"
                                        style={styles}
                                        onClick={this.toggleFavourite}
                                    >
                                        <img
                                            src={_url("assets/images/favourite_heart_not.svg")}
                                            alt=""
                                            className="favourite-icon wd24he24"
                                        />
                                        Add
                                    </a>
                                    <a
                                        className="text-color-white add-icon-with-no-text"
                                        style={{ display: "none" }}
                                        onClick={this.toggleFavourite}
                                    >
                                        <img
                                            src={_url("assets/images/favourite_heart_not.svg")}
                                            alt=""
                                            className="favourite-icon wd24he24"
                                        />
                                    </a>
                                </span>
                            )
                    )
                    // !this.isLogin() && (
                    //         <span style={{ marginLeft: "10px" }}>
                    //             <a
                    //                 className="btn-custom bg-blue text-color-white add-login-with-text"
                    //                 style={styles}
                    //                 onClick={() => {
                    //                     this.props.history.push("/login")
                    //                     localStorage.setItem('fromUrl', fromUrl)
                    //                 }}
                    //             >
                    //                 <img
                    //                     src={_url("assets/images/favourite_heart_not.svg")}
                    //                     alt=""
                    //                     className="favourite-icon wd24he24"
                    //                 />
                    //                 Add
                    //             </a>
                    //             <a
                    //                 className="text-color-white add-login-with-no-text"
                    //                 style={{ display: "none" }}
                    //                 onClick={() => {
                    //                     this.props.history.push("/login")
                    //                     localStorage.setItem('fromUrl', fromUrl)
                    //                 }}
                    //             >
                    //                 <img
                    //                     src={_url("assets/images/favourite_heart_not.svg")}
                    //                     alt=""
                    //                     className="favourite-icon wd24he24"
                    //                 />
                    //             </a>
                    //         </span>
                    //     )
                }
            </div>
        )
    }

    renderBanner(images) {
        const stypeImage = {
            objectFit: 'cover',
            width: "100%",
            height: "600px"
        }
        const imagesToRender = this.props.finishedLoading ? images : []
        switch (imagesToRender.length) {
            case 0:
                return (
                    // <Col className="banner1" lg={14} md={14} sm={0} xs={0}>
                    //     <img
                    //         src={_url("assets/images/book/banner-bg1.jpg")}
                    //         alt=""
                    //         style={stypeImage}
                    //     />

                    // </Col>
                    // <Col className="banner2" lg={10} md={10} sm={0} xs={0}>
                    //     <Row>
                    //         <Col className="banner21" xs={24}>
                    //             <img
                    //                 src={_url("assets/images/book/banner-bg2.jpg")}
                    //                 alt=""
                    //                 style={{ width: "100%", height: "300px", objectFit: "cover" }}
                    //             />
                    //             {this.renderFav(2.5, 20)}
                    //         </Col>
                    //         <Col className="banner22" lg={12} md={12}>
                    //             <img
                    //                 src={_url("assets/images/book/banner-bg3.jpg")}
                    //                 alt=""
                    //                 style={{ width: "100%", height: "300px", objectFit: "cover" }}
                    //             />

                    //         </Col>
                    //         <Col className="banner23" lg={12} md={12}>
                    //             <img
                    //                 src={_url("assets/images/book/banner-bg4.jpg")}
                    //                 alt=""
                    //                 style={{ width: "100%", height: "300px", objectFit: "cover" }}
                    //             />
                    //             {this.renderPhotos(5)}
                    //         </Col>
                    //     </Row>
                    // </Col>
                    <Row className="banner-image-normal">
                        <div style={stypeImage}>
                        </div>
                    </Row>
                );
            case 1:
                return (
                    <Row className="banner-image-normal">
                        <Col className="banner-one-pic" lg={12}>
                            <img
                                src={imagesToRender[0].url}
                                alt=""
                                style={{ width: "100%", height: "600px", objectFit: "cover" }}
                            />
                            {this.renderFav(1, 10)}
                            {this.renderPhotos(1)}
                        </Col>
                    </Row>
                );
            case 2:
                return (
                    <Row className="banner-image-normal">
                        <Col className="banner-two-pic" lg={6}>
                            <img
                                src={imagesToRender[0].url}
                                alt=""
                                style={{ width: "100%", height: "600px", objectFit: "cover" }}
                            />
                        </Col>
                        <Col className="banner-two-pic" lg={6}>
                            <img
                                src={imagesToRender[1].url}
                                alt=""
                                style={{ width: "100%", height: "600px", objectFit: "cover" }}
                            />
                            {this.renderFav(2.5, 20)}
                            {this.renderPhotos(2.5)}
                        </Col>
                    </Row>
                );
            case 3:
                return (
                    <Row className="banner-image-normal">
                        <Col className="banner-two-pic" lg={6}>
                            <img
                                src={imagesToRender[0].url}
                                alt=""
                                style={{ width: "100%", height: "600px", objectFit: "cover" }}
                            />
                        </Col>
                        <Col className="banner-two-pic" lg={6}>
                            <div className="banner21">
                                <img
                                    src={imagesToRender[1].url}
                                    alt=""
                                    style={{ width: "100%", height: "300px", objectFit: "cover" }}
                                />
                                {this.renderFav(2.5)}
                            </div>
                            <div className="banner22">
                                <img
                                    src={imagesToRender[2].url}
                                    alt=""
                                    style={{ width: "100%", height: "300px", objectFit: "cover" }}
                                />
                                {this.renderPhotos(2.5)}
                            </div>
                        </Col>
                    </Row>
                );
            default:
                return (
                    <Row className="banner-image-normal">
                        <Col className="banner1" lg={14} md={14} sm={0} xs={0}>
                            <img
                                src={imagesToRender[0].url}
                                alt=""
                                style={{ width: "100%", height: "600px", objectFit: "cover" }}
                            />
                        </Col>
                        <Col className="banner2" lg={10} md={10} sm={0} xs={0}>
                            <Row>
                                <Col className="banner21" xs={24}>
                                    <img
                                        src={imagesToRender[1].url}
                                        alt=""
                                        style={{ width: "100%", height: "300px", objectFit: "cover" }}
                                    />
                                    {this.renderFav(2.5)}
                                </Col>
                                <Col className="banner22" lg={12} md={12}>
                                    <img
                                        src={imagesToRender[2].url}
                                        alt=""
                                        style={{ width: "100%", height: "300px", objectFit: "cover" }}
                                    />
                                </Col>
                                <Col className="banner23" lg={12} md={12}>
                                    <img
                                        src={imagesToRender[3].url}
                                        alt=""
                                        style={{ width: "100%", height: "300px", objectFit: "cover" }}
                                    />
                                    {this.renderPhotos(2.5)}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                )
        }
    }

    render() {
        let path = '';
        if (typeof window !== 'undefined') {
            path = (window.location.protocol + '//' + window.location.host + '/entertainer/' + this.props.entertainer._id)
        }
        const { photos, video_links, user_id } = this.props.entertainer;

        const images = photos && photos.length && photos.filter(photo => photo).map(i => {
            return {
                url: _urlImage(i),
            }
        });
        const name = user_id && (user_id.first_name + ' ' + user_id.last_name);

        const videos = video_links && video_links.length && video_links.map(item => {
            return {
                url: item,
            }
        });

        const checkEmptyAuth = _.isEmpty(this.props.auth);
        const checkEmptyFav = this.props.auth.favourites;
        const isCustomer = !checkEmptyAuth && this.props.auth.user_id.role === 'CUSTOMER' ? true : false;
        if (checkEmptyAuth === false && isCustomer && checkEmptyFav === undefined) {
            return <Icon type="sync" spin />
        }
        return (
            <div className="banner-book">
                {this.renderPicture(images || [], videos || [])}
                {this.renderShare(path, name)}
                {this.renderBanner(images || [])}
                {this.renderSlider(images || [], videos || [])}
                <div className="share-button-hide-mobile" style={{ display: "none" }}>
                    {this.renderFav(2.5, 20)}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
};

const mapDispatchToProps = dispatch => {
    return {
        updateAuth: (data) => {
            dispatch(updateAuth(data));
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BannerBook));

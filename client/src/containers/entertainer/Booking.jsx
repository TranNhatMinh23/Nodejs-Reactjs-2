import React from "react";
import { Header, Footer } from "../../components";
import { BannerBook, BookInfo } from "../../components/entertainer/book";
import { connect } from "react-redux";
import { Icon } from 'antd';
import { getInfoBooking } from "../../actions/booking";
import request from '../../api/request';
import { _store } from "index";
import { KEY_PERSIST_STORE } from "config";
class Booking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      finishedLoading: false,
      dataBooked:
        props.location &&
          props.location.state &&
          props.location.state.dataBooked
          ? props.location.state.dataBooked
          : null
    };
  }

  isLogin = () => {
    const token =
      _store.getState().auth.remember ?
        _store.getState().auth.token :
        sessionStorage.getItem(`${KEY_PERSIST_STORE}-accessToken`)
    return !!token;
    // return this.props.auth.user_id && this.props.auth.user_id._id && this.props.auth.user_id._id.length > 0;
  }

  async componentDidMount() {
    let _id = this.props.match.params.id;
    await this.props.getInfoBooking(_id);
    if (!this.isLogin() || (this.isLogin() && _store.getState().auth && _store.getState().auth._id !== _id)) {
      request({ hideLoading: true }).put(`/entertainers/${_id}/increase/views`)
    }
    this.setState({ finishedLoading: true })
  };

  async componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.setState({ finishedLoading: false })
      const _id = nextProps.match.params.id;
      await this.props.getInfoBooking(_id);
      this.setState({ finishedLoading: true })
    }
  }

  render() {
    let { entertainer, isLoadingEntertainer } = this.props;
    let { dataBooked, finishedLoading } = this.state;
    return (
      <div className="book-page">
        <Header />
        <div className="book-content">
          <BannerBook finishedLoading={finishedLoading} entertainer={entertainer} />
          {isLoadingEntertainer && <Icon type="sync" spin />}
          {!isLoadingEntertainer && <BookInfo entertainer={entertainer} dataBooked={dataBooked} />}
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    entertainer: store.booking.entertainer,
    isLoadingEntertainer: store.booking.isLoadingEntertainer,
  };
};

export default connect(
  mapStateToProps,
  {
    getInfoBooking
  }
)(Booking);

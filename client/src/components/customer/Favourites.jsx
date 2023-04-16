import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import internalApi from '../../config/internalApi';
import { connect } from 'react-redux';
import { updateAuth } from '../../actions/auth';
import { Icon } from 'antd';
import { ResultCard } from '../../components/search/index'
class Favourites extends Component {
    constructor(props) {
        super(props);
        this.state = {
            favourites: []
        }
    }

    componentWillMount() {
        internalApi.get(`customers/${this.props.auth._id}/favourites`).then(res => {
            if (res.success) {
                this.setState({ favourites: res.data.favourites });
            }
        })
    }

    onRemove = (id) => {
        internalApi.put(`customers/${this.props.auth._id}/toggleFavourites`, { ent_id: id }).then(res => {
            if (res.success) {
                const favourites = this.state.favourites.filter(f => f._id !== id);
                this.setState({ favourites });
                this.props.updateAuth({
                    favourites: res.data.favourites
                });
            }
        });
    }

    render() {
        const { favourites } = this.state;
        return (
            <div className="dasdboard-content">
                <div className="profile-customer">
                    <div className="container">
                        <div className="content mybooking" style={{ paddingTop: 0 }}>
                            <div className="title">
                                <Row className="book-now-title">
                                    <Col>
                                        <h3 className='title-booking'>My Favourites</h3>
                                    </Col>
                                    <Col sm="auto">
                                        <Button
                                            className="fill-btn btn-book-gig"
                                            onClick={() => this.props.history.push("/search")}
                                        >
                                            <Icon type="plus" /> Book a Gig
                                    </Button>
                                    </Col>
                                </Row>
                            </div>
                            {favourites.length ?  <div className="favourites">
                                <Row>
                                    {
                                        favourites.map((f, index) => {
                                            return (
                                                f &&
                                                <Col lg={3} md={4} sm={6} xs={12} key={index}>
                                                    <ResultCard
                                                        auth={this.props.auth}
                                                        item={f}
                                                        text={'Book now'}
                                                        onRemove={this.onRemove}
                                                    />
                                                </Col>
                                            )
                                        })
                                    }
                                </Row>
                            </div> :  null
                        }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateAuth: (data) => {
            dispatch(updateAuth(data));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Favourites);

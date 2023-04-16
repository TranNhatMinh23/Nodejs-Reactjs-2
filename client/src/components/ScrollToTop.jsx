import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class ScrollToTop extends Component {
    componentDidUpdate(prevProps) {
        if (this.props.location.pathname === '/' && this.props.how_it_work.status) {
            return;
        }
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return this.props.children
    }
}

const mapStateToProps = state => {
    return {
        how_it_work: state.how_it_work,
    }
}

export default withRouter(connect(mapStateToProps)(ScrollToTop));

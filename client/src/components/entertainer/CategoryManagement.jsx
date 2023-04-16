import React, { Component } from "react";
import { Row, Col, Button, Collapse, CardBody, Card } from 'reactstrap';
import { Icon, message } from 'antd';
import { connect } from 'react-redux';
import { _url } from "../../config/utils";
import { ProgressProfile } from './index';
import { getCompletedSteps, setCompletedStep } from "../../actions/progress_profile";
import {
    updateEntertainerTypes,
    updateEntertainerCategories
} from '../../actions/entertainer_type';
import { UpdatePlan } from '../../components';

class CategoryManagement extends Component {
    constructor(props) {
        super(props);
        let rawData = null;
        if (props.auth.categories_selected) {
            try {
                rawData = JSON.parse(props.auth.categories_selected[0].rawData)
            } catch (error) {

            }
        }
        let idLevel1Active = null
        if (props.auth.act_type_id) {
            idLevel1Active = props.auth.act_type_id.id
        }
        this.state = {
            entertainer_types: props.entertainer_types,
            ...rawData,
            [rawData ? `idLevel${rawData.levelSelected}Active` : '']: '',
            idLevel1Active: idLevel1Active || '',
            newCategoryLevel1: null
        }
    }

    componentWillReceiveProps(nextProps) {
        let rawData = null;
        if (nextProps.auth.categories_selected) {
            try {
                rawData = JSON.parse(nextProps.auth.categories_selected[0].rawData)
            } catch (error) {

            }
        }
        let idLevel1Active = null
        if (nextProps.auth.act_type_id) {
            idLevel1Active = nextProps.auth.act_type_id.id
        }
        this.setState({
            entertainer_types: this.state.entertainer_types,
            ...rawData,
            idLevel1Active: idLevel1Active || '',
            [rawData ? `idLevel${rawData.levelSelected}Active` : '']: ''
        })
    }

    componentWillMount() {
        this.props.updateEntertainerTypes();
    }

    toggle = () => {
        this.setState(state => ({ collapse: !state.collapse }));
    }

    onChangeLevel = (item, level) => {
        let oldLevel1 = (this.props.auth.act_type_id && this.props.auth.act_type_id.id) || null;
        if (oldLevel1 && level === 1 && item.id !== oldLevel1) {
            this.setState({
                newCategoryLevel1: item,
                selectedCategories: []
            })

        } else if (oldLevel1 && level === 1 && item.id === oldLevel1) {
            this.setState({
                newCategoryLevel1: null
            })
        }
        let id = item.id;
        let { selectedCategories } = this.state;
        if (!selectedCategories) selectedCategories = [];
        this.setState({
            [`idLevel${level}Active`]: id,
            [`${level <= 1 ? 'idLevel2Active' : ''}`]: '',
            [`${level <= 2 ? 'idLevel3Active' : ''}`]: '',
            [`${level <= 3 ? 'idLevel4Active' : ''}`]: '',

            //for mobile
            [`idLevel${level}Collapse`]: id === this.state[`idLevel${level}Collapse`] ? '' : id,
        })

        //check if it is smallest level
        if ((level < 4 && !this.hasChild(level + 1, id)) || (level === 4)) {
            let levelSelected = level;
            let idLevel1Selected = this.state.idLevel1Selected;
            let idLevel2Selected = this.state.idLevel2Selected;
            let idLevel3Selected = this.state.idLevel3Selected;

            if (this.isExistInList(selectedCategories, item)) {
                for (let i = 0; i < selectedCategories.length; i++) {
                    if (selectedCategories[i].id === id) {
                        selectedCategories.splice(i, 1);
                        break;
                    }
                }
            } else {
                if (selectedCategories.length > 0 && (level !== this.state.levelSelected || (this.state[`idLevel${level - 1}Selected`] !== this.state[`idLevel${level - 1}Active`]))) {
                    selectedCategories = [];
                    levelSelected = level;
                }
                if (level === 2) {
                    idLevel1Selected = this.state.idLevel1Active
                    idLevel2Selected = '';
                    idLevel3Selected = '';
                }
                if (level === 3) {
                    idLevel1Selected = this.state.idLevel1Active
                    idLevel2Selected = this.state.idLevel2Active
                    idLevel3Selected = '';
                }
                if (level === 4) {
                    idLevel1Selected = this.state.idLevel1Active
                    idLevel2Selected = this.state.idLevel2Active
                    idLevel3Selected = this.state.idLevel3Active
                }
                selectedCategories.push(item);
            }
            if (selectedCategories.length === 0) {
                levelSelected = null;
                idLevel1Selected = '';
                idLevel2Selected = '';
                idLevel3Selected = '';
            }
            this.setState({
                selectedCategories,
                levelSelected,
                idLevel1Selected,
                idLevel2Selected,
                idLevel3Selected,
            })
        }
        document.getElementsByClassName('')
    }

    hasChild = (level, id) => {
        let hasChild = this.state.entertainer_types['level' + level].filter(item => {
            if (item.parentId === id) return true; return false;
        })[0]
        if (hasChild) return true;
        return false;
    }

    getListSelected = () => {
        let _selectedCategories = [];
        let {
            levelSelected,
            entertainer_types,
            idLevel1Selected,
            idLevel2Selected,
            idLevel3Selected,
            selectedCategories
        } = this.state;
        let categoryLv1 = '';
        let categoryLv2 = '';
        let categoryLv3 = '';
        if (levelSelected === 2) {
            categoryLv1 = entertainer_types.level1.filter(item => {
                return (item.id === idLevel1Selected)
            })[0]
            selectedCategories.forEach(item => {
                _selectedCategories.push(
                    {
                        name: categoryLv1.categoryName + '/ ' + item.categoryName,
                        item,
                        arr: [categoryLv1.id, item.id]
                    }
                )
            })
        }
        if (levelSelected === 3) {
            categoryLv1 = entertainer_types.level1.filter(item => {
                return (item.id === idLevel1Selected)
            })[0]
            categoryLv2 = entertainer_types.level2.filter(item => {
                return (item.id === idLevel2Selected)
            })[0]
            selectedCategories.forEach(item => {
                _selectedCategories.push(
                    {
                        name: categoryLv1.categoryName + '/ ' + categoryLv2.categoryName + '/ ' + item.categoryName,
                        item,
                        arr: [categoryLv1.id, categoryLv2.id, item.id]

                    }
                )
            })
        }
        if (levelSelected === 4) {
            categoryLv1 = entertainer_types.level1.filter(item => {
                return (item.id === idLevel1Selected)
            })[0]
            categoryLv2 = entertainer_types.level2.filter(item => {
                return (item.id === idLevel2Selected)
            })[0]
            categoryLv3 = entertainer_types.level3.filter(item => {
                return (item.id === idLevel3Selected)
            })[0]
            selectedCategories.forEach(item => {
                _selectedCategories.push(
                    {
                        name: categoryLv1.categoryName + '/ ' + categoryLv2.categoryName + '/ ' + categoryLv3.categoryName + '/ ' + item.categoryName,
                        item,
                        arr: [categoryLv1.id, categoryLv2.id, categoryLv3.id, item.id]

                    }
                )
            })
        }
        return _selectedCategories
    }

    isExistInList = (list, itemCheck) => {
        if (!list) list = [];
        let isExist = list.filter(item => {
            return (itemCheck.id === item.id);
        })[0];
        if (isExist) return true; return false;
    }

    onUpdateTalentCategories = () => {
        let data = this.getListSelected();
        if (data.length > 0) {
            let rawData = { ...this.state };
            delete rawData.entertainer_types;
            let arrIdCategories = [];
            data.map(item => {
                item.arr.map(item2 => {
                    arrIdCategories.push(item2);
                    return true;
                })
                return true;
            })
            const succ = res => {
                message.success("Successfully updated")
            }
            console.log('newCategoryLevel1', this.state.newCategoryLevel1);
            this.props.updateEntertainerCategories(
                this.props.auth.id,
                {
                    selectedCategories: arrIdCategories,
                    level: this.state.levelSelected,
                    rawData: JSON.stringify(rawData),
                    newCategoryLevel1: this.state.newCategoryLevel1
                },
                succ
            );
            const pg_data = {
                id: this.props.auth._id,
                alias: "SelectCategories",
            }
            this.props.setCompletedStep(pg_data);
            setTimeout(() => {
                this.props.getCompletedSteps(this.props.auth._id);
            }, 300);
        } else {
            message.success("Please choose categories!");
            return false;
        }
    }

    render() {
        let { level1, level2, level3, level4 } = this.state.entertainer_types;
        let selectedCategories = this.state.selectedCategories || [];
        return (
            <div className="dasdboard-content category-management">
                <div className="profile-customer my-gig settings">
                    <ProgressProfile tabName="SelectCategories" />
                    <UpdatePlan />
                    <div className="container">
                        <div className="content clearfix">
                            <div className="title">
                                {/* <h6>Category Management</h6> */}
                                <h3>Categories</h3>
                                <h5>Select the categories that you feel your act falls under. (Tip from the team: the more categories you select, the more search results you will show up in)</h5>
                                <Row className="site">
                                    <div className="wrapper">
                                        <div className="parent level1 clearfix">

                                            {
                                                level1 && level1.map(item => {
                                                    return (
                                                        <div
                                                            key={Math.random() + ''}
                                                            onClick={() => this.onChangeLevel(item, 1)}
                                                            className={`child ${this.state.idLevel1Active === item.id ? ' active' : ''}`}
                                                        >{item.categoryName}</div>
                                                    )
                                                })
                                            }

                                        </div>
                                        <Row className="content-level">
                                            <Col md={4} sm={12}>
                                                <ul>
                                                    {
                                                        level2 && level2.map(item => {
                                                            if (item.parentId === this.state.idLevel1Active)
                                                                return (
                                                                    <li
                                                                        key={Math.random() + ''}

                                                                        onClick={() => this.onChangeLevel(item, 2)}
                                                                        className={`level2 ${this.state.idLevel2Active === item.id ? 'active' : ''} ${selectedCategories.length > 0 &&
                                                                            (this.state.idLevel2Selected === item.id || this.isExistInList(this.state.selectedCategories, item)) ? 'bold' : ''}`}
                                                                    >{item.categoryName}
                                                                        {
                                                                            selectedCategories.length > 0 &&
                                                                                (this.state.idLevel2Selected === item.id || this.isExistInList(this.state.selectedCategories, item)) ?
                                                                                <span className="tick"><img alt='' src={_url("assets/images/tick2.png")}></img></span>
                                                                                : (this.hasChild(3, item.id) ? <span className="right"></span> : '')
                                                                        }
                                                                    </li>
                                                                )
                                                            return false;
                                                        })
                                                    }
                                                </ul>
                                            </Col>
                                            <Col md={4} sm={12}>
                                                <ul>
                                                    {
                                                        level3.map(item => {
                                                            if (item.parentId === this.state.idLevel2Active)
                                                                return (
                                                                    <li
                                                                        key={Math.random() + ''}

                                                                        onClick={() => this.onChangeLevel(item, 3)}
                                                                        className={`level3 ${this.state.idLevel3Active === item.id ? 'active' : ''} ${selectedCategories.length > 0 &&
                                                                            (this.state.idLevel2Selected === item.id || this.isExistInList(this.state.selectedCategories, item)) ? 'bold' : ''}`}
                                                                    >{item.categoryName}
                                                                        {
                                                                            selectedCategories.length > 0 &&
                                                                                (this.state.idLevel3Selected === item.id || this.isExistInList(this.state.selectedCategories, item)) ?
                                                                                <span className="tick"><img alt='' src={_url("assets/images/tick2.png")}></img></span>
                                                                                : (this.hasChild(4, item.id) ? <span className="right"></span> : '')
                                                                        }
                                                                    </li>
                                                                )
                                                            return false;

                                                        })
                                                    }
                                                </ul>
                                            </Col>
                                            <Col md={4} sm={12}>
                                                <ul>
                                                    {
                                                        level4.map(item => {
                                                            if (item.parentId === this.state.idLevel3Active)
                                                                return (
                                                                    <li
                                                                        key={Math.random() + ''}
                                                                        onClick={() => this.onChangeLevel(item, 4)}
                                                                        className={`level4 ${this.state.idLevel4Active === item.id ? 'active' : ''} ${selectedCategories.length > 0 &&
                                                                            (this.state.idLevel2Selected === item.id || this.isExistInList(this.state.selectedCategories, item)) ? 'bold' : ''}`}
                                                                    >{item.categoryName}

                                                                        {
                                                                            this.isExistInList(selectedCategories, item) ?
                                                                                <span className="tick large"><img alt='' src={_url("assets/images/tick2.png")}></img></span> : ''
                                                                        }

                                                                    </li>
                                                                )
                                                            return false;
                                                        })
                                                    }
                                                </ul>
                                            </Col>
                                        </Row>
                                        <div className="selected-categories">
                                            <h5>Selected categories</h5>
                                            <div className="selected">
                                                {
                                                    this.getListSelected().map(item => {
                                                        return (
                                                            <div className='item-categories' key={Math.random() + ''} onClick={() => this.onChangeLevel(item.item, this.state.levelSelected)}>
                                                                <span>{item.name}</span>
                                                                <Icon type="close-circle" />
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            <Button disabled={this.getListSelected().length <= 0} type="button" className="btn-update" onClick={this.onUpdateTalentCategories}>Update</Button>
                                        </div>
                                    </div>
                                </Row>
                                <Row className="mobile">
                                    <div className="wrapper">
                                        <div className="parent level1 clearfix">

                                            {
                                                level1 && level1.map(item => {
                                                    return (
                                                        <div
                                                            key={Math.random() + ''}
                                                            onClick={() => this.onChangeLevel(item, 1)}
                                                            className={`child ${this.state.idLevel1Active === item.id ? ' active' : ''}`}
                                                        >{item.categoryName}</div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <Row className="content-level">
                                            <Col md={4} sm={12}>
                                                <ul>
                                                    {
                                                        level2.map((item, index) => {
                                                            if (item.parentId === this.state.idLevel1Active)
                                                                return (
                                                                    <div key={index}>
                                                                        <li
                                                                            onClick={() => {
                                                                                this.onChangeLevel(item, 2)
                                                                                this.toggle();
                                                                            }}
                                                                            className={`level2 ${this.state.idLevel2Active === item.id ? 'active' : ''}`}
                                                                        >{item.categoryName}
                                                                            {
                                                                                selectedCategories.length > 0 &&
                                                                                    (this.state.idLevel2Selected === item.id || this.isExistInList(this.state.selectedCategories, item)) ?
                                                                                    <span className="tick"><img alt='' src={_url("assets/images/tick2.png")}></img></span>
                                                                                    : (this.hasChild(3, item.id) ? <span className="right"></span> : '')
                                                                            }
                                                                        </li>
                                                                        {
                                                                            this.hasChild(3, item.id) &&
                                                                            <Collapse isOpen={this.state.idLevel2Collapse === item.id}>
                                                                                <Card>
                                                                                    <CardBody>
                                                                                        {
                                                                                            level3.map((item3, index3) => {
                                                                                                if (item3.parentId === item.id)
                                                                                                    return (
                                                                                                        <div key={index3}>
                                                                                                            <li
                                                                                                                onClick={() => {
                                                                                                                    this.onChangeLevel(item3, 3)
                                                                                                                    this.toggle();
                                                                                                                }}
                                                                                                                className={`level3 ${this.state.idLevel3Active === item3.id ? 'active' : ''}`}
                                                                                                            >{item3.categoryName}
                                                                                                                {
                                                                                                                    selectedCategories.length > 0 &&
                                                                                                                        (this.state.idLevel3Selected === item3.id || this.state.selectedCategories.includes(item3)) ?
                                                                                                                        <span className="tick"><img alt='' src={_url("assets/images/tick2.png")}></img></span>
                                                                                                                        : (this.hasChild(4, item3.id) ? <span className="right"></span> : '')
                                                                                                                }
                                                                                                            </li>
                                                                                                            {
                                                                                                                this.hasChild(4, item3.id) &&
                                                                                                                <Collapse isOpen={this.state.idLevel3Collapse === item3.id}>
                                                                                                                    <Card>
                                                                                                                        <CardBody>
                                                                                                                            {
                                                                                                                                level4.map(item4 => {
                                                                                                                                    if (item4.parentId === item3.id)
                                                                                                                                        return (
                                                                                                                                            <li
                                                                                                                                                key={Math.random() + ''}
                                                                                                                                                onClick={() => this.onChangeLevel(item4, 4)}
                                                                                                                                                className={`level4 ${this.state.idLevel4Active === item4.id ? 'active' : ''}`}
                                                                                                                                            >{item4.categoryName}

                                                                                                                                                {
                                                                                                                                                    selectedCategories.includes(item4) ?
                                                                                                                                                        <span className="tick large"><img alt='' src={_url("assets/images/tick2.png")}></img></span> : ''
                                                                                                                                                }

                                                                                                                                            </li>
                                                                                                                                        )
                                                                                                                                    return false;

                                                                                                                                })
                                                                                                                            }
                                                                                                                        </CardBody>
                                                                                                                    </Card>
                                                                                                                </Collapse>
                                                                                                            }
                                                                                                        </div>
                                                                                                    )
                                                                                                return false;
                                                                                            })
                                                                                        }
                                                                                    </CardBody>
                                                                                </Card>
                                                                            </Collapse>
                                                                        }
                                                                    </div>
                                                                )
                                                            return false;
                                                        })
                                                    }
                                                </ul>
                                            </Col>

                                        </Row>
                                        <div className="selected-categories">
                                            <h5>Selected categories</h5>
                                            <div className="selected">
                                                {
                                                    this.getListSelected().map(item => {
                                                        return (
                                                            <div className='item-categories' key={Math.random() + ''} onClick={() => this.onChangeLevel(item.item, this.state.levelSelected)}>
                                                                <span>{item.name}</span>
                                                                <Icon type="close-circle" />
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            <Button disabled={this.getListSelected().length <= 0} type="button" className="btn-update" onClick={this.onUpdateTalentCategories}>Update</Button>

                                        </div>

                                    </div>
                                </Row>
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
        entertainer_types: state.entertainer_types.categories,
        auth: state.auth
    }
}

const mapDispatchToprops = dispatch => ({
    getCompletedSteps: id => {
        dispatch(getCompletedSteps(id));
    },
    setCompletedStep: data => {
        dispatch(setCompletedStep(data));
    },
    updateEntertainerTypes: () => {
        dispatch(updateEntertainerTypes());
    },
    updateEntertainerCategories: (id, data, succ) => {
        dispatch(updateEntertainerCategories(id, data, succ));
    }
});

export default connect(mapStateToProps, mapDispatchToprops)(CategoryManagement);
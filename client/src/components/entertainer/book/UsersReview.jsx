import React from "react";
import { List, Avatar } from "antd";
import { _url, _urlServer } from "../../../config/utils";
import moment from 'moment';
import { Row, Col } from 'antd';
import StarRatings from "react-star-ratings";

const listData = [];
for (let i = 0; i < 23; i++) {
  listData.push({
    title: `Paul`,
    avatar: _url("assets/images/Paul.png"),
    description: "December 2018",
    content: "Etiam egestas leo sit amet lacus euismod, a aliquet lectus venenatis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean sem urna, posuere a nunc fermentum, volutpat volutpat ipsum. Aliquam pellentesque turpis vel mattis mollis. Maecenas ante mi, facilisis et turpis gravida, egestas varius leo. Aenean vitae mauris et nulla faucibus tempor…",
    extra: "Read more",
  });
}

class UsersReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { reviews } = this.props;
    return (
      <div className="users-review">
        <h3 className="read-more-title">Reviews</h3>
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: page => {
              console.log(page);
            },
            pageSize: 3
          }}
          dataSource={reviews}
          footer={
            <div>
              <b>ant design</b> footer part
            </div>
          }
          renderItem={item => (
            <List.Item
              key={item._id}
            >
              <Row type="flex" justify="space-between" align="middle">
                <Col span={12}>
                  <List.Item.Meta
                    avatar={<Avatar size={50} src={item.customer_id && item.customer_id.user_id && item.customer_id.user_id.avatar ? _urlServer(item.customer_id.user_id.avatar) : _url('assets/images/identity-verified.svg')} />}
                    title={<a href={item.href}>{item.customer_id && item.customer_id.user_id && (item.customer_id.user_id.first_name + ' ' + item.customer_id.user_id.last_name)}</a>}
                    description={moment(item.createdAt).format('MMMM YYYY')}
                  />
                  <p style={{ wordBreak: 'break-word', marginRight: '10px' }}>
                    {item.message}
                  </p>
                </Col>
                <Col span={12}>
                  <div>
                    <Row type="flex" justify="space-between" align="middle">
                      <Col md={12}>
                        <span>Overall Satisfaction</span>
                      </Col>
                      <Col md={12}>
                        <StarRatings
                          rating={item.satisfaction}
                          starRatedColor="#05c4e1"
                          starHoverColor="#05c4e1"
                          backGround="transparent"
                          starWidthAndHeight='50px'
                          svgIconViewBox='0 0 20 20'
                          numberOfStars={5}
                          starDimension='15px'
                          starSpacing='4px'
                          name="professionalism"
                          isSelectable={false}
                          svgIconPath='M10.5 1l3.48 6.02L20 8.206l-3.98 5.044.704 6.749-6.224-3.399L4.276 20 5 13.16 1 8.206l6.02-1.188z'
                        />
                      </Col>
                    </Row>
                    <Row type="flex" justify="space-between" align="middle">
                      <Col md={12}>
                        <span>Professionalism</span>
                      </Col>
                      <Col md={12}>
                        <StarRatings
                          rating={item.professionalism}
                          starRatedColor="#05c4e1"
                          starHoverColor="#05c4e1"
                          backGround="transparent"
                          starWidthAndHeight='50px'
                          svgIconViewBox='0 0 20 20'
                          numberOfStars={5}
                          starDimension='15px'
                          starSpacing='4px'
                          name="professionalism"
                          isSelectable={false}
                          svgIconPath='M10.5 1l3.48 6.02L20 8.206l-3.98 5.044.704 6.749-6.224-3.399L4.276 20 5 13.16 1 8.206l6.02-1.188z'
                        />
                      </Col>
                    </Row>
                    <Row type="flex" justify="space-between" align="middle">
                      <Col md={12}>
                        <span>Communication</span>
                      </Col>
                      <Col md={12}>
                        <StarRatings
                          rating={item.communication}
                          starRatedColor="#05c4e1"
                          starHoverColor="#05c4e1"
                          backGround="transparent"
                          starWidthAndHeight='50px'
                          svgIconViewBox='0 0 20 20'
                          numberOfStars={5}
                          starDimension='15px'
                          starSpacing='4px'
                          name="professionalism"
                          isSelectable={false}
                          svgIconPath='M10.5 1l3.48 6.02L20 8.206l-3.98 5.044.704 6.749-6.224-3.399L4.276 20 5 13.16 1 8.206l6.02-1.188z'
                        />
                      </Col>
                    </Row>
                    <Row type="flex" justify="space-between" align="middle">
                      <Col md={12}>
                        <span>Punctuality</span>
                      </Col>
                      <Col md={12}>
                        <StarRatings
                          rating={item.punctuality}
                          starRatedColor="#05c4e1"
                          starHoverColor="#05c4e1"
                          backGround="transparent"
                          starWidthAndHeight='50px'
                          svgIconViewBox='0 0 20 20'
                          numberOfStars={5}
                          starDimension='15px'
                          starSpacing='4px'
                          name="professionalism"
                          isSelectable={false}
                          svgIconPath='M10.5 1l3.48 6.02L20 8.206l-3.98 5.044.704 6.749-6.224-3.399L4.276 20 5 13.16 1 8.206l6.02-1.188z'
                        />
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default UsersReview;

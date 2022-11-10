import { Button, Card, CardBody, CardImg, CardTitle, Col, Row } from "reactstrap";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import Cart from "../components/Cart";
import { useContext } from "react";
import AppContext from "../context/AppContext";

const GET_RESTAURANT_DISHES = gql`
  query ($id: ID!) {
    restaurant(id: $id) {
      id
      name
      dishes {
        id
        name
        description
        price
        image {
          url
        }
      }
    }
  }
`;

const Restaurants = () => {
  const { addItem } = useContext(AppContext);
  const router = useRouter();
  const {loading, error, data} = useQuery(GET_RESTAURANT_DISHES, {
    variables: {id: router.query.id },
  });

  if (error) {
    return <h1>料理の読み込みに失敗しました</h1>;
  }

  if (loading) {
    return <h1>Loading...</h1>
  }

  if (data) {
    const { restaurant } = data;
    return (
      <>
      <h1>{restaurant.name}</h1>
      <Row>
        {restaurant.dishes.map((dish) => (
          <Col xs="6" sm="4" key={dish.id} style={{ padding: 0 }}>
          <Card style={{ margin: "0 10px" }}>
            <CardImg src={`${process.env.NEXT_PUBLIC_API_URL}${dish.image.url}`} top={true} style={{ height: 250 }} />
            <CardBody>
              <CardTitle>商品名：{dish.name}</CardTitle>
              <CardTitle>概要：{dish.description}</CardTitle>
              <CardTitle>値段：{dish.price}円</CardTitle>
            </CardBody>
            <div className="card-footer">
              <Button outline color="primary" onClick={() => addItem(dish)}>
                + カートに入れる
              </Button>
            </div>
          </Card>
        </Col>
        ))}
        <Col xs="3" style={{padding: 0}}>
          <div>
            <Cart />
          </div>
        </Col>
      </Row>
      </>
    );
  } else {
    return <h1>料理が見つかりませんでした</h1>
  }
}

export default Restaurants;
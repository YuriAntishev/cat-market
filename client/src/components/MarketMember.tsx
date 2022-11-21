import { List, Typography } from "antd";
import { catMarketPricesItems, catMarketPricesItem } from "../App";

const { Title } = Typography;

const MarketMember = ({
  catMarketPrices,
}: {
  catMarketPrices: catMarketPricesItems[];
}) => {
  if (catMarketPrices) {
    return (
      <List
        size="large"
        bordered
        dataSource={catMarketPrices}
        renderItem={(item: catMarketPricesItems, id: number) => (
          <List.Item>
            <Title level={4}>Day {id + 1}</Title>
            {item?.map(({ breed, buy, sell }: catMarketPricesItem, id: number) => {
              return (
                <div key={id}>
                  <div>Breed: {breed}</div>
                  <div>Buy: {buy}</div>
                  <div>Sell: {sell}</div>
                </div>
              );
            })}
          </List.Item>
        )}
      />
    );
  }
  return null;
};

export default MarketMember;

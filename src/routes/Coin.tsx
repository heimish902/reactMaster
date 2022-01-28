import React, { useEffect, useState } from 'react';
import {
  Link,
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import Price from './Price';
import Chart from './Chart';
import { useQuery } from 'react-query';
import { fetchCoinInfo, fetchCoinTickers } from './api';
// interface
interface RouteParams {
  coinId: string;
}
interface RouteState {
  name: string;
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

// style
const Container = styled.div`
  max-width: 480px;
  padding: 0px 20px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 3em;
  font-weight: 600;
  text-align: center;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.p`
  text-align: center;
`;

const Overview = styled.div`
  padding: 10px 20px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  background-color: ${(props) => props.theme.boxColor};

  p {
    font-size: 0.9em;
  }
  p:first-child {
    margin-bottom: 10px;
  }
`;

const OverviewItem = styled.div`
  text-align: center;
`;

const Description = styled.div`
  margin-bottom: 30px;
  line-height: 1.5em;
`;

const Tabs = styled.div`
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
`;
const Tab = styled.span<{ isActive: boolean }>`
  display: inline-block;
  width: 48%;
  text-align: center;
  border: none;
  border-radius: 50px;
  background-color: ${(props) => props.theme.boxColor};

  a {
    display: block;
    padding: 10px;
    font-weight: 600;
    color: ${(props) => (props.isActive ? props.theme.accentColor : props.theme.textColor)};
  }
`;
const Button = styled.button`
  width: 40px;
  height: 40px;
  margin-top: 10px;
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  border: none;
  border-radius: 100%;
  background-color: ${(props) => props.theme.boxColor};
  cursor: pointer;
`;

interface ICoinProps {
  isDark: boolean;
}
function Coin({ isDark }: ICoinProps) {
  // const [loading, setLoading] = useState(true);
  // const [info, setInfo] = useState<InfoData>();
  // const [priceInfo, setPriceInfo] = useState<PriceData>();

  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();
  const priceMatch = useRouteMatch('/:coinId/price');
  const chartMatch = useRouteMatch('/:coinId/chart');

  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(['info', coinId], () =>
    fetchCoinInfo(coinId)
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
    ['tickers', coinId],
    () => fetchCoinTickers(coinId),
    { refetchInterval: 5000 }
  );

  const loading = infoLoading || tickersLoading;
  const history = useHistory();

  return (
    <Container>
      <Helmet>
        <title>{state?.name ? state.name : loading ? 'Loading...' : infoData?.name}</title>
      </Helmet>
      <Header>
        <Button
          onClick={() => {
            history.push('/');
          }}
        >
          &lt;
        </Button>
        <Title>{state?.name ? state.name : loading ? 'Loading...' : infoData?.name}</Title>
      </Header>
      {loading ? (
        <Loader>'Loading...'</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <p>RANK</p>
              <p>{tickersData?.rank}</p>
            </OverviewItem>
            <OverviewItem>
              <p>SYMBOL</p>
              <p>${tickersData?.symbol}</p>
            </OverviewItem>
            <OverviewItem>
              <p>PRICE</p>
              <p>{`$${tickersData?.quotes.USD.price.toFixed(2)}`}</p>
            </OverviewItem>
          </Overview>
          <Description>
            <p>{infoData?.description}</p>
          </Description>
          <Overview>
            <OverviewItem>
              <p>TOTAL_SUPLY</p>
              <p>{tickersData?.total_supply}</p>
            </OverviewItem>
            <OverviewItem>
              <p>MAX_SUPPLY</p>
              <p>{tickersData?.max_supply}</p>
            </OverviewItem>
          </Overview>

          <Tabs>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>PRICE</Link>
            </Tab>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>CHART</Link>
            </Tab>
          </Tabs>
          <Switch>
            <Route path={`/:coinId/price`}>
              <Price coinId={coinId} />
            </Route>
            <Route path={`/:coinId/chart`}>
              <Chart isDark={isDark} coinId={coinId} />
            </Route>
          </Switch>
        </>
      )}
    </Container>
  );
}

export default Coin;

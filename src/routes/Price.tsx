import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { fetchCoinHistory, fetchCoinTickers } from './api';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.ul`
  width: 100%;
  height: 280px;
  border-radius: 20px;
`;

const List = styled.li`
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 15px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.boxColor};
`;

const Title = styled.span`
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

const Desc = styled.span<{ isCalc: boolean }>`
  font-weight: 600;
  color: ${(props) => (props.isCalc ? props.theme.upColor : props.theme.downColor)};
`;

interface PriceProps {
  coinId: string;
}

function Price({ coinId }: PriceProps) {
  const { isLoading, data } = useQuery(['coinPrice', coinId], () => fetchCoinTickers(coinId), {
    refetchInterval: 5000,
  });

  return (
    <>
      {isLoading ? (
        'Loading Price'
      ) : (
        <Container>
          <List>
            <Title>Last Updated : </Title>
            <span>{data.last_updated.replace('T', ', ').replace('Z', '')}</span>
          </List>
          <List>
            <Title>Price : </Title>
            <Desc isCalc={data?.quotes.USD.price.toString().slice(0, 1) !== '-'}>
              {`$${data?.quotes.USD.price.toFixed(2)}`}
            </Desc>
          </List>
          <List>
            <Title> Percent Change 24H : </Title>
            <Desc isCalc={data?.quotes.USD.percent_change_24h.toString().slice(0, 1) !== '-'}>
              {`${data?.quotes.USD.percent_change_24h.toFixed(2)}%`}
            </Desc>
          </List>
          <List>
            <Title> Percent Change 30D : </Title>
            <Desc isCalc={data?.quotes.USD.percent_change_30d.toString().slice(0, 1) !== '-'}>
              {`${data?.quotes.USD.percent_change_30d.toFixed(2)}%`}
            </Desc>
          </List>
        </Container>
      )}
    </>
  );
}
export default Price;

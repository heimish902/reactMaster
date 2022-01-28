import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import React, { useEffect, useState } from 'react';
import { isConstructorDeclaration } from 'typescript';
import { useQuery } from 'react-query';
import { fetchCoins } from './api';

// style
const Container = styled.div`
  max-width: 480px;
  padding: 0px 20px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  position: absolute;
  top: 38px;
  right: 30px;
  display: flex;
  align-items: center;
  width: 70px;
  height: 30px;
  padding: 10px;
  color: ${(props) => props.theme.textColor};
  border: none;
  border-radius: 20px;
  background-color: ${(props) => props.theme.boxColor};
`;

const Circle = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  background-color: #fff;
`;
const CoinsList = styled.ul``;

const Coin = styled.li`
  margin-bottom: 10px;
  border-radius: 15px;
  font-weight: 600;
  color: ${(props) => props.theme.bgColor};
  background-color: ${(props) => props.theme.subColor};
  a {
    padding: 20px;
    display: flex;
    align-items: center;
    transition: color 0.2s ease-in;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Title = styled.h1`
  font-size: 3em;
  font-weight: 600;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.p`
  text-align: center;
`;

const Img = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 15px;
`;
// interface
interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

interface ICoinsProps {
  toggleDark: () => void;
}

// function
function Coins({ toggleDark }: ICoinsProps) {
  // useQuery(key, fetcher function)
  const { isLoading, data } = useQuery<ICoin[]>('allCoins', fetchCoins);

  return (
    <Container>
      <Helmet>
        <title>COINS</title>
      </Helmet>
      <Header>
        <Title>COINS</Title>
        <Button onClick={toggleDark}>
          <Circle />
        </Button>
      </Header>
      {isLoading ? (
        <Loader>'Loading...'</Loader>
      ) : (
        <CoinsList>
          {data?.slice(0, 50).map((coin) => (
            <Coin key={coin.id}>
              <Link
                to={{
                  pathname: `/${coin.id}`,
                  state: { name: coin.name },
                }}
              >
                <Img
                  src={`https://cryptoicon-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                />
                {coin.name} &rarr;
              </Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}

export default Coins;

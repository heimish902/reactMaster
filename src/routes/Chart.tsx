import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { fetchCoinHistory } from './api';
import ApexChart from 'react-apexcharts'; // 차트
import { useEffect, useState } from 'react';

interface ChartProps {
  coinId: string;
  isDark: boolean;
}
interface IHistory {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}
interface Result {
  x: globalThis.Date;
  y: number[];
}
function Chart({ coinId, isDark }: ChartProps) {
  const { isLoading, data: historyData } = useQuery<IHistory[]>(
    ['ohlcv', coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 5000,
    }
  );
  const endDate = Math.floor(Date.now() / 1000);
  const startDate = endDate - 60 * 60 * 24 * 7 * 2; // 2주

  const date = historyData?.map((price) => {
    return price.time_close.slice(5, 10);
  });
  const newDate = date ? `${date[0]} ~ ${date[14]}` : null;

  return (
    <div>
      {isLoading ? (
        'Loading Chart...'
      ) : (
        <ApexChart
          type='candlestick'
          series={[
            {
              data: historyData?.map((price) => {
                return {
                  x: price.time_close.slice(5, 10),
                  y: [
                    price.open.toFixed(2),
                    price.high.toFixed(2),
                    price.low.toFixed(2),
                    price.close.toFixed(2),
                  ],
                };
              }),
            },
          ]}
          options={{
            title: {
              text: `${coinId} (${newDate})`,
              align: `center`,
              margin: 10,
              style: {
                fontSize: '18px',
                fontWeight: 400,
              },
            },
            theme: {
              mode: isDark ? 'dark' : 'light',
            },
            chart: {
              height: 500,
              width: 500,
              toolbar: {
                show: false,
              },
              background: 'transparent',
            },
            yaxis: {
              show: false,
            },
            xaxis: {
              type: 'datetime',
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;

import { request } from 'graphql-request';


export const getTokenPrice = async () => {
  return fetch("https://api.coingecko.com/api/v3/coins/usd")
    .then(response => response.json())
    .then(response => {
      const price = response?.market_data?.current_price?.usd as string || '0.00';
      const totalVolume = response?.market_data?.total_volume?.usd || '0.00';
      return {
        price: Number(Number.parseFloat(price).toFixed(3)),
        totalVolume: Number(Number.parseFloat(totalVolume).toFixed(3))
      };
    });;
}

export async function pager(endpoint, query, variables = {}) {
  if (endpoint.includes('undefined')) return {};

  let data: any = {};
  let skip = 0;
  let flag = true;
  while (flag) {
    flag = false;
    const req = await request(endpoint, query, variables);

    Object.keys(req)?.forEach((key) => {
      data[key] = data[key] ? [...data[key], ...req[key]] : req[key];
    });

    Object.values(req)?.forEach((entry: any) => {
      if (entry?.length === 1000) flag = true;
    });

    if (Object.keys(variables).includes('first')) break;

    skip += 1000;
    variables = { ...variables, skip };
  }
  return data;
}

export * from './blocks';
export * from './blocks'
export * from './exchange'
export * from './masterchef'
export * from './status'
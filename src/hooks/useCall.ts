import useSWR, { SWRConfiguration } from 'swr'
const fetcher = (args: any[]) => (<any>fetch)(...args).then((res: any) => res.json())
export default function useCall(route: string, options?: SWRConfiguration) {
  return useSWR(route, fetcher, options)
}

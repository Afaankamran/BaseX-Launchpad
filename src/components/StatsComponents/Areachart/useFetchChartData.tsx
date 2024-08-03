import fetchChartData from '@/pages/api/chartData';
import useSWR from 'swr';

const useDataFetching = (url) => {


    try {
        
        const { data, error, isValidating, mutate } = useSWR(url, async (url) => {
            const response = await fetch(url,  {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });
            const data = await response.json();
            return data;
        });


        
        return {
            data,
            error,
            isValidating,
            refresh: mutate,
        };
    } catch (error) {
        console.error(error)
    }
};

export default useDataFetching;
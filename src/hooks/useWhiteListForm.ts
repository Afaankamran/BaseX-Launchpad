import { isAddress } from '@/functions';
import { useState } from 'react';

export default function useWhiteListForm() {
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [parsedData, setParsedData] = useState<string[]>([]);
  const [invalidData, setInvalidData] = useState<string[]>([]);
  function handleChange(event) {
    const { value } = event.target;
    setValue(value);
    if (!value) {
      setInvalidData([]);
      setError('Users is a required field');
      return;
    }
    const inData = [];
    const splitArray = value.split('\n');
    splitArray.map((item) => {
      if (item && !isAddress(item)) {
        inData.push(item);
      }
      return item;
    });
    setInvalidData(inData);
    if (inData.length > 0) {
      setError('Please delete the invalid addresses below');
      return;
    }
    setError('');

    setParsedData(splitArray.filter((item) => item && isAddress(item)));
  }
  function reset() {
    setError(``);
    setValue(``);
    setParsedData([]);
    setInvalidData([]);
  }
  return { handleChange, value, parsedData, error, invalidData, reset };
}

import { CircularProgress } from '@mui/material';

/**
 * Takes in custom size and stroke for circle color, default to primary color as fill,
 * need ...rest for layered styles on top
 */
export default function Loader({
  size = 16,
  stroke = '#FFFFFF',
  ...rest
}: {
  size?: number;
  stroke?: string;
  [k: string]: any;
}) {
  return <CircularProgress size={size} />;
}

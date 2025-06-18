import { ClipLoader } from 'react-spinners';
import type { LoaderProps } from '../types';

const Loader = ({
  size = 40,
  color = '#3b82f6',
  className = '',
}: LoaderProps) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <ClipLoader size={size} color={color} />
    </div>
  );
};

export default Loader;

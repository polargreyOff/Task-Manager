import { ClipLoader, CircleLoader, PulseLoader } from 'react-spinners'

export const Preloader = () => (
  <div className="flex justify-center items-center">
    <ClipLoader color="#3B82F6" size={50} />
  </div>
)
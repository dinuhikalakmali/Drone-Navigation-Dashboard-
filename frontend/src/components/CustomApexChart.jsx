import Loader from '@/components/Loader';
import { useLayoutContext } from '@/context/useLayoutContext';
import { Suspense, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
const CustomApexChart = ({
  type,
  height,
  width = '100%',
  getOptions,
  series,
  className
}) => {
  const {
    skin,
    theme
  } = useLayoutContext();
  const options = useMemo(() => getOptions(), [skin, theme]);
  return <Suspense fallback={<Loader />}>
      <ReactApexChart type={type ?? options.chart?.type} height={height ?? options.chart?.height} width={width ?? options.chart?.width} options={options} series={options.series ?? series} className={className} />
    </Suspense>;
};
export default CustomApexChart;
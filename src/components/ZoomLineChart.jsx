import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';

export default function ZoomLineChart() {
  return (
    <LineChartPro
      height={300}
      xAxis={[
        {
          zoom: true,
          scaleType: 'point',
          data: data.map((v, i) => i),
        },
      ]}
      series={[
        {
          label: 'FORTNITE Players',
          data: data.map((v) => v.y1),
          color: '#2a96efff',
          
        },
        {
          label: 'PUBG Players',
          data: data.map((v) => v.y2),
          color: '#e4eb12ff',
          
        },
      ]}
      slotProps={{
        legend: {
          labelStyle: {
            fill: '#ffffff',
          },
        },
      }}
      sx={{
        '& .MuiChartsAxis-tickLabel': {
          fill: '#ffffffff',
        },
        '& .MuiChartsAxis-title': {
          fill: '#ffffffff',
        },
        '& .MuiChartsAxis-label': {
          fill: '#ffffffff',
        },
        '& .MuiChartsLegend-series text': {
          fill: '#ffffffff !important',
        },
        '& .MuiChartsLegend-label': {
          fill: '#ffffffff !important',
        },
        '& .MuiChartsAxis-line': {
          stroke: '#ffffffff',
        },
        '& .MuiChartsAxis-tick': {
          stroke: '#ffffffff',
        },
        '& .MuiLineElement-root': {
          strokeWidth: 2,
        },
      }}
    />
  );
}

const data = [
  {
    y1: 443.28,
    y2: 153.9,
  },
  {
    y1: 110.5,
    y2: 217.8,
  },
  {
    y1: 175.23,
    y2: 286.32,
  },
  {
    y1: 195.97,
    y2: 325.12,
  },
  {
    y1: 351.77,
    y2: 144.58,
  },
  {
    y1: 43.253,
    y2: 146.51,
  },
  {
    y1: 376.34,
    y2: 309.69,
  },
  {
    y1: 31.514,
    y2: 236.38,
  },
  {
    y1: 231.31,
    y2: 440.72,
  },
  {
    y1: 108.04,
    y2: 20.29,
  },
  {
    y1: 321.77,
    y2: 484.17,
  },
  {
    y1: 120.18,
    y2: 54.962,
  },
  {
    y1: 366.2,
    y2: 418.5,
  },
  {
    y1: 451.45,
    y2: 181.32,
  },
  {
    y1: 294.8,
    y2: 440.9,
  },
  {
    y1: 121.83,
    y2: 273.52,
  },
  {
    y1: 287.7,
    y2: 346.7,
  },
  {
    y1: 134.06,
    y2: 74.528,
  },
  {
    y1: 104.5,
    y2: 150.9,
  },
  {
    y1: 413.07,
    y2: 26.483,
  },
  {
    y1: 74.68,
    y2: 333.2,
  },
  {
    y1: 360.6,
    y2: 422.0,
  },
  {
    y1: 330.72,
    y2: 488.06,
  },
];

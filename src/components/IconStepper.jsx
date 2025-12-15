import * as React from 'react';
import Stepper from '@mui/joy/Stepper';
import Step, { stepClasses } from '@mui/joy/Step';
import StepIndicator, { stepIndicatorClasses } from '@mui/joy/StepIndicator';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import InsertEmoticonOutlinedIcon from '@mui/icons-material/InsertEmoticonOutlined';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useThemeContext } from '../context/themeContext';

export default function IconStepper() {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  return (
    <Stepper
      size="lg"
      sx={{
        width: '100%',
        '--StepIndicator-size': '4rem',
        '--Step-connectorInset': '0.1px',
        [`& .${stepIndicatorClasses.root}`]: {
          borderWidth: 4,
        },
        [`& .${stepClasses.root}::after`]: {
          height: 4,
        },
        [`& .${stepClasses.completed}`]: {
          [`& .${stepIndicatorClasses.root}`]: {
            borderColor: isDark ? '#b3003d' : '#A52A2A',
            color: isDark ? '#ffffff' : '#000000',
            backgroundColor: isDark ? 'transparent' : 'transparent',
          },
          '&::after': {
            bgcolor: '#b3003d',
          },
        },
        [`& .${stepClasses.active}`]: {
          [`& .${stepIndicatorClasses.root}`]: {
            borderColor: isDark ? '#A52A2A' : '#A52A2A',
            color: isDark ? '#ffffff' : '#000000',
          },
        },
        [`& .${stepClasses.disabled} *`]: {
          color: isDark ? 'neutral.outlinedDisabledColor' : '#cccccc',
        },
      }}
    >
      <Step
        completed
        orientation="vertical"
        indicator={
          <StepIndicator variant="outlined" color="danger">
            <SportsEsportsIcon />
          </StepIndicator>
        }
      />
      <Step
        orientation="vertical"
        completed
        indicator={
          <StepIndicator variant="outlined" color="danger">
            <KeyboardIcon />
          </StepIndicator>
        }
      />
      <Step
        orientation="vertical"
        completed
        indicator={
          <StepIndicator variant="outlined" color="danger">
            <DesktopWindowsOutlinedIcon />
          </StepIndicator>
        }
      />
      <Step
        orientation="vertical"
        active
        indicator={
          <StepIndicator variant="solid" color="danger">
            <InsertEmoticonOutlinedIcon />
          </StepIndicator>
        }
      >
      </Step>
      <Step
        orientation="vertical"
        disabled
        indicator={
          <StepIndicator variant="outlined" color="neutral">
            <CheckCircleRoundedIcon />
          </StepIndicator>
        }
      />
    </Stepper>
  );
}

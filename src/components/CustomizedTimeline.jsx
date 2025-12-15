import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import HotelIcon from '@mui/icons-material/Hotel';
import RepeatIcon from '@mui/icons-material/Repeat';
import Typography from '@mui/material/Typography';
import { Card, CardContent } from "@mui/material";

export default function CustomizedTimeline() {
  return (
    <Timeline position="alternate">
      <TimelineItem>
        <TimelineOppositeContent
          sx={{ m: 'auto 0' }}
          align="right"
          variant="body2"
          color="text.secondary"
        >
          9:30 am
        </TimelineOppositeContent>

        <TimelineSeparator>
          <TimelineConnector />
          <TimelineDot>
            <FastfoodIcon />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>

        {/* ---------------- CARD ADDED HERE ---------------- */}
        <TimelineContent sx={{ py: '12px', px: 2 }}>
          <Card sx={{ maxWidth: 300 }}>
            <CardContent>
              <Typography variant="h6">Eat</Typography>
              <Typography color="text.secondary">
                Because you need strength
              </Typography>
            </CardContent>
          </Card>
        </TimelineContent>
        {/* --------------------------------------------------- */}
      </TimelineItem>

      <TimelineItem>
        <TimelineOppositeContent
          sx={{ m: 'auto 0' }}
          variant="body2"
          color="text.secondary"
        >
          10:00 am
        </TimelineOppositeContent>

        <TimelineSeparator>
          <TimelineConnector />
          <TimelineDot color="primary">
            <LaptopMacIcon />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>

        <TimelineContent sx={{ py: '12px', px: 2 }}>
          <Card sx={{ maxWidth: 300 }}>
            <CardContent>
              <Typography variant="h6">Code</Typography>
              <Typography color="text.secondary">
                Because it&apos;s awesome!
              </Typography>
            </CardContent>
          </Card>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineSeparator>
          <TimelineConnector />
          <TimelineDot color="primary" variant="outlined">
            <HotelIcon />
          </TimelineDot>
          <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
        </TimelineSeparator>

        <TimelineContent sx={{ py: '12px', px: 2 }}>
          <Card sx={{ maxWidth: 300 }}>
            <CardContent>
              <Typography variant="h6">Sleep</Typography>
              <Typography color="text.secondary">
                Because you need rest
              </Typography>
            </CardContent>
          </Card>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineSeparator>
          <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
          <TimelineDot color="secondary">
            <RepeatIcon />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>

        <TimelineContent sx={{ py: '12px', px: 2 }}>
          <Card sx={{ maxWidth: 300 }}>
            <CardContent>
              <Typography variant="h6">Repeat</Typography>
              <Typography color="text.secondary">
                Because this is the life you love!
              </Typography>
            </CardContent>
          </Card>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}


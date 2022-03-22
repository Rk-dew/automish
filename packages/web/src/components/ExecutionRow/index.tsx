import * as React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CardActionArea from '@mui/material/CardActionArea';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { DateTime } from 'luxon';

import type { IExecution } from '@automatisch/types';
import * as URLS from 'config/urls';
import { CardContent, Typography } from './style';

type ExecutionRowProps = {
  execution: IExecution;
}

const getHumanlyDate = (timestamp: number) => DateTime.fromMillis(timestamp).toLocaleString(DateTime.DATETIME_MED);

export default function ExecutionRow(props: ExecutionRowProps): React.ReactElement {
  const { execution } = props;
  const { flow } = execution;

  return (
    <Link to={URLS.EXECUTION(execution.id)}>
      <Card sx={{ mb: 1 }}>
        <CardActionArea>
          <CardContent>
            <Stack
              justifyContent="center"
              alignItems="flex-start"
              spacing={1}
            >
              <Typography variant="h6" noWrap>
                {flow.name}
              </Typography>

              <Typography variant="caption" noWrap>
                {getHumanlyDate(parseInt(execution.createdAt, 10))}
              </Typography>
            </Stack>

            <Box>
              <ArrowForwardIosIcon sx={{ color: (theme) => theme.palette.primary.main }} />
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}

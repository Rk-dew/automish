import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActionArea from '@mui/material/CardActionArea';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import useFormatMessage from 'hooks/useFormatMessage';
import AppIcon from 'components/AppIcon';
import * as URLS from 'config/urls';
import type { App } from 'types/app';
import { CardContent, Typography } from './style';

type AppRowProps = {
  application: App;
}

const countTranslation = (value: React.ReactNode) => (
  <>
    <Typography variant="body1">
      {value}
    </Typography>
    <br />
  </>
);

function AppRow(props: AppRowProps) {
  const formatMessage = useFormatMessage();
  const { name, primaryColor, iconUrl, connectionCount } = props.application;

  return (
    <Link to={URLS.APP(name.toLowerCase())}>
      <Card sx={{ my: 2 }}>
        <CardActionArea>
          <CardContent>
            <Box>
              <AppIcon name={name} url={iconUrl} color={primaryColor} />
            </Box>

            <Box>
              <Typography variant="h6">
                {name}
              </Typography>
            </Box>

            <Box sx={{ px: 2 }}>
              <Typography variant="caption" color="textSecondary">
                {formatMessage('app.connectionCount', { count: countTranslation(connectionCount) })}
              </Typography>
            </Box>

            <Box sx={{ px: 2 }}>
              <Typography variant="caption" color="textSecondary">
                {formatMessage('app.flowCount', { count: countTranslation(0) })}
              </Typography>
            </Box>

            <Box>
              <ArrowForwardIosIcon sx={{ color: (theme) => theme.palette.primary.main }} />
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}

export default AppRow;

import React, { useEffect, useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { InfoIcon } from '../styles/material';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import PushPinIcon from '@mui/icons-material/PushPin';
import axios from 'axios';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});


const EventCardDetails = ({events, event}) => {
  const { currentUserInfo } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState();
  const theme = useTheme();
  const iconColors = theme.palette.secondary.contrastText;
  const inverseMode = theme.palette.secondary.main;

  // <YouTubeIcon key={'youtube'} sx={{ color: iconColors }} />
  // <CardContent sx={{ bgcolor: inverseMode }}></CardContent>
  // <Typography paragraph sx={{ bgcolor: inverseMode }}></Typography>
  useEffect(() => {
    getPins();
    getUserId();
  }, []);

  const getPins = () => {
    axios.get('/api/events/list/pins')
      .then(responseObj => {
        setPins(responseObj.data.map((event, index) => event.eventAPIid));
      })
      .catch(err => console.error('GET PINS', err));
  };

  const [ pins, setPins ] = useState(['foo', 'bar']);

  const postEvent = () => {
    axios.post('/api/events/list/pins', {
      userId: userInfo.id,
      eventAPIid: event.eventId
    })
      .then(response => {
        // console.log('POST SUCCESS', response);
      })
      .then(getPins)
      .catch(err => console.error('POST ERROR', err));
  };

  const deleteEvent = () => {
    axios.delete('/api/events/list/pins', { data: { eventAPIid: event.eventId } })
      .then(() => {
        // console.log('DELETE SUCCESS');
        getPins();
      })
      .catch(err => console.error('axios delete error', err));
  };

  const handleClick = () => {
    if (pins.includes(event.eventId)) {
      return deleteEvent();
    } else if (pins == ['foo', 'bar']) {
      setPins(event.eventId);
      return postEvent();
    } else if (!pins.includes(event.eventId)) {
      return postEvent();
    }
  };

  const navigate = useNavigate();
  let date = event.eventDate;
  date = moment(date).add(1, 'day').format('MMMM Do YYYY');
  const image = event.artistInfo[0].artistImages[0].url;

  const getDetails = () => {
    // console.log('navigate', event.eventId);
    navigate(`/details/?id=${event.eventId}`);
  };

  const getUserId = () => {
    axios.get(`/api/profile/${currentUserInfo.id}`)
      .then(({ data }) => {
        setUserInfo(data);
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <Paper
        sx={{
          p: 2,
          margin: 'auto auto 10px auto',
          maxWidth: 500,
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        }}
      >

        <Grid container spacing={4} alignItems='center' sx={{ bgcolor: inverseMode }}>
          <Grid item>
            <ButtonBase
              sx={ { width: 128, height: 128 } }
              onClick={()=> getDetails()}>
              <InfoIcon/>
              <Img alt="alt tag" src={image} />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography variant="body2" gutterBottom paragraph sx={{ bgcolor: inverseMode }}>
                  {event.eventName}
                  {event.artistInfo.map((artist, index) => (
                    <div key={`artistName${index}`}>
                      {artist.artistName}
                    </div>
                  ))}
                  {date}
                  <br/>
                  {event.venueInfo.map((venue, index) => (
                    <div key={`venue${index}`}>
                      {Object.values(venue.address)}
                      <br/>
                      {venue.city}, {venue.state} {venue.postalCode}
                    </div>
                  ))
                  }
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <PushPinIcon
                id={event.eventId}
                color={pins.includes(event.eventId) ? 'secondary' : 'action'}
                onClick={ handleClick }
              />
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default EventCardDetails;

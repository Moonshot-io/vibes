import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import {
  Box,	Grid,	Card,	CardHeader,	CardMedia,	CardContent,	CardActions,	Collapse,	Typography,	FavoriteIcon,	ExpandMoreIcon,	YouTubeIcon,	TwitterIcon,	MusicNoteIcon,	FacebookIcon,	QuizIcon,	InstagramIcon,	LanguageIcon, Item
} from '../styles/material';
import EventCards from './EventCards';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';
// import { StyledCard } from './Theme';
interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const ArtistInfoCard = ({artistProps}) => {
  // console.log(artistProps);
  const themeContext = useContext(ThemeContext);
  const {mode, setMode, toggleMode} = themeContext;
  console.log(mode);
  const [expanded, setExpanded] = React.useState(false);
  const [events, setEvents] = useState(
    [{
      name: 'No events found',
      image: '/images/patrick-perkins-pay-artists.jpg',
      description: 'There are currently no events found for this artist.',
      id: 1001,
    }]
  );
  const {
    artistName,
    bio,
    facebook,
    homepage,
    image,
    instagram,
    itunes,
    twitter,
    wiki,
    youtube,
  } = artistProps;

  // console.log(image);
  // if (!image.length) {
  //   image = 'https://source.unsplash.com/random/?music-festival';
  // }

  const socials = {
    youtube: [youtube, <YouTubeIcon key={'youtube'}/>],
    twitter: [twitter, <TwitterIcon key={'twitter'}/>],
    facebook: [facebook, <FacebookIcon key={'fb'}/>],
    instagram: [instagram, <InstagramIcon key={'insta'}/>],
    homepage: [homepage, <LanguageIcon key={'homepage'}/>],
    itunes: [itunes, <MusicNoteIcon key={'music'}/>],
    wiki: [wiki, <QuizIcon key={'wiki'}/>],
  };
  // console.log(artist);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const getArtistEvents = (artist) => {
    const noSpecialChars: string = artist
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    axios.get('/favArtists/events', { params: { keyword: noSpecialChars } })
      .then((responseObj) => {
        setEvents(responseObj.data.events);
      })
      .catch(err => console.error(err));
  };

  return (
    // <StyledCard>
    <Card>
      <CardHeader
        title={artistName}
      />
      <CardMedia
        component="img"
        height="194"
        image={image}
        alt={artistName}
      />
      <CardContent>
        <Typography noWrap variant="body2" color="text.secondary">
          {bio}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={()=>{
            handleExpandClick();
            getArtistEvents(artistName);
          }}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent id={artistName}>
          <Typography paragraph>Bio:</Typography>
          <Typography paragraph>
            {bio}
          </Typography>
          <Typography paragraph>Socials:</Typography>
          <Typography paragraph>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                {Object.keys(socials).map((social, index) => {
                  return (
                    <Grid item key={`social${index}`}>
                      <Item>
                        <a href={socials[social][0]}>{socials[social][1]}</a>
                      </Item>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              {
                events.length > 1
                  ? <Grid item id={artistName}>
                    <Typography paragraph>Events:</Typography>
                    { events.map((eventObj, index) => {
                      return <EventCards events={eventObj} key={`event${index}`}/>;
                    })}
                  </Grid>
                  : <Typography paragraph>No Upcoming Events</Typography>
              }
            </Grid>
          </Box>
        </CardContent>
      </Collapse>
    </Card>
    // </StyledCard>
  );
};

export default ArtistInfoCard;

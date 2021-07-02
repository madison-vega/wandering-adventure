import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
// import ParticlesBg from 'particles-bg';
import LoginButton from '../../components/Login';
import { useAuth0 } from '@auth0/auth0-react';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import './loginpage.css';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing(1),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        width: '25ch',
    },
}));
const style = createMuiTheme();

style.typography.h4 = {
    fontSize: '1rem',
    '@media (min-width:300px)': {
        fontSize: '1.5rem',
    },
    [style.breakpoints.up('sm')]: {
        fontSize: '2rem',
    },
    fontFamily: "IM Fell English SC",


};
style.typography.h5 = {
    fontSize: '.5rem',
    '@media (min-width:300px)': {
        fontSize: '1rem',
    },
    [style.breakpoints.up('md')]: {
        fontSize: '1.5rem',
    },
    fontFamily: "IM Fell English SC",
}

export default function LoginPage() {
    const { isAuthenticated } = useAuth0();
    const history = useHistory();
    const classes = useStyles();
    if (isAuthenticated) {
        history.push('/userpage')
    }
    return (

        <Grid
            container
            justify="center"
            alignItems="center"
        >
            <Grid item s={2} />
            <Grid item s={6}>
                <Card id='cardbox'>
                    <Container>
                        <div className={classes.root}>
                            <div id='login'>
                                <ThemeProvider theme={style}>
                                    <Typography variant="h4">
                                        Welcome to Wandering Adventure!
                                    </Typography>
                                    <Typography variant="h5">
                                        Click below to enter the Tavern of the Wanderer.
                                    </Typography>
                                </ThemeProvider>


                                <Container>
                                    <LoginButton />

                                </Container>
                            </div>
                        </div>
                    </Container>
                </Card>
            </Grid>
            <Grid item s={2} />



        </Grid>

    );
}

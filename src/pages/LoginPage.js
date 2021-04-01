import React from 'react';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { getURL } from '../adapters/api-planilha';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    buttonProgress: {
        color: 'blue',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
}));



function LoginPage() {
    const classes = useStyles();
    const history = useHistory();
    const [loading, setLoading] = React.useState(false);

    function doLogin(e) {
        e.preventDefault();
        const user = e.target.elements.user.value;
        const password = e.target.elements.password.value;
        if(!loading) {
            setLoading(true);
            const params = new URLSearchParams();
            params.append('login', user);
            params.append('password', password);
            params.append('type', 'doLogin');
            fetch(getURL(), {
                method: 'post',
                redirect: 'follow',
                body: params
            }).then((response) => response.json().then((json) => {
                console.log(json);
                setLoading(false);
                history.push('/selecao', {login: user, grupos: json.data.grupos, vacinas: json.data.vacinas, lotes: json.data.lotes});
            }))
        }

    }

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Vacinas
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container>
                <CssBaseline />

                <form className={classes.form} noValidate onSubmit={doLogin}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="user"
                        label="Usuário"
                        name="user"
                        autoComplete="user"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Senha"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <div className={classes.wrapper}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            className={classes.submit}
                        >
                            Entrar
                        </Button>
                        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>
                </form>
            </Container>
        </div>
    );
}

export default LoginPage;
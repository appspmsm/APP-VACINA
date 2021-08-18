import React, {useEffect} from 'react';
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
    version: {
        position: 'fixed',
        bottom: '15px',
        left: '15px'
    }
}));



function LoginPage() {
    const classes = useStyles();
    const history = useHistory();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState();

    useEffect(() => {
        localStorage.setItem('version', '1.3.1');
        localStorage.setItem('versionDate', '18/08/2021');
        const login = localStorage.getItem('login');
        const token = localStorage.getItem('token');
        if(login && token){
            history.push('/selecao')
        }
    }, []);

    function doLogin(e) {
        e.preventDefault();
        const user = e.target.elements.user.value;
        const password = e.target.elements.password.value;
        setError(null);
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
                if(json.success){
                    localStorage.setItem('login', user);
                    localStorage.setItem('token', json.token);
                    history.push('/selecao');
                } else {
                    setError(json.message);
                }
            })).catch(e => {
                console.log(e);
                setLoading(false);
                alert('Não foi possível conectar ao servidor.')
            });
        }

    }

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Vacina SM
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
                        error={!!error}
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
                        error={!!error} helperText={error ? error: ""}
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
            <div className={classes.version}>Versão 1.3.1 - 18/08/2021</div>
        </div>
    );
}

export default LoginPage;
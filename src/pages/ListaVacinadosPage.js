import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Button, Card, CardContent, Container, Divider, List, ListItem, ListItemText } from '@material-ui/core';
import React, { useState } from 'react';
import { getVacinados } from '../adapters/api-planilha';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    card: {
        marginTop: '20px'
    },
    buttonDiv: {
        position: 'fixed',
        bottom: 20,
        textAlign: 'center',
        width: '100%'
    },
    buttonAdd: {
        width: '100px'
    }
}));

function ListaVacinadosPage(props) {
    const classes = useStyles();
    const login = props.location.state.login;
    const grupo = props.location.state.grupo;
    const vacina = props.location.state.vacina;
    const lote = props.location.state.lote;
    const vacinados = [];
    const history = useHistory();

    const handleAdd = () => {
        history.push('/vacinar', {login: login, grupo: grupo, vacina: vacina, lote: lote})
    };

    return (
        <div>
            <CssBaseline />
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6">
                        Vacinas
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Card className={classes.card}>
                    <CardContent>
                        <p>Grupo: {grupo}</p>
                        <p>Vacina: {vacina}</p>
                        <p>Lote: {lote}</p>
                    </CardContent>
                </Card>
                <Divider variant="middle" />
                <Typography variant="h6">Registros de vacinaçao</Typography>
                <List dense>
                    {vacinados.map((vacinado) => {
                        return (
                            <ListItem key={vacinado.cpf} button divider>
                                <ListItemText
                                    primary={vacinado.nome}
                                    secondary={vacinado.cpf}
                                />
                            </ListItem>
                        )
                    })}
                    
                </List>
                <div className={classes.buttonDiv}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.buttonAdd}
                        onClick={handleAdd}
                        >Adicionar
                    </Button>
                </div>
        </div>
    );
}

export default ListaVacinadosPage;
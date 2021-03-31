import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Button, Card, CardContent, Container, Divider, List, ListItem, ListItemText, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { getVacinados } from '../adapters/api-planilha';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
    divCpf: {
        width: '100%',
        textAlign: 'center'
    },
    tfCpf: {
        width: '90%'
    },
    button: {
        marginTop: '20px'
    },
    pacienteDiv: {
        paddingLeft: '20px'
    }
}));

function VacinarPage(props) {
    const classes = useStyles();
    const [visibility, setVisibility] = React.useState(false);

    const handleSearch = () => {
        setVisibility(true);
    }

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
                <div className={classes.divCpf}>
                    <Typography variant="h6">Buscar paciente</Typography>
                    <TextField className={classes.tfCpf} id="cpf" label="CPF"  />
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        startIcon={<SearchIcon />}
                        onClick={handleSearch}
                    >
                        Buscar
                    </Button>
                </div>
                {visibility ? <div className={classes.pacienteDiv}>
                        <p>João da Silva</p>
                        <p>Data de nascimento: 01/01/1980</p>
                        <p>Sexo Masculino</p>
                    </div> : null}
        </div>
    );
}

export default VacinarPage;
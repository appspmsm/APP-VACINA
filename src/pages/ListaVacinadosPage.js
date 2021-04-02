import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Button, Card, CardContent, Divider, List, ListItem, ListItemText } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import AppToolbar from '../components/AppToolbar';

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
    const [grupo, setGrupo] = useState();
    const [vacina, setVacina] = useState();
    const [lote, setLote] = useState();
    const vacinados = [];
    const history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token){
            console.log(props);
            if(props.location.state){
                setGrupo(props.location.state.grupo);
                setVacina(props.location.state.vacina);
                setLote(props.location.state.lote);
            } else {
                history.push('/selecao');
            }
            /*setLoading(true);
            const params = new URLSearchParams();
            params.append('token', token);
            params.append('type', 'getGrupoVacinaLote')
            fetch(getURL(), {
                method: 'post',
                redirect: 'follow',
                body: params
            }).then((response) => response.json().then((json) => {
                console.log(json);
                setLoading(false);
                if(json.success){
                    setGrupos(json.grupos);
                    setVacinas(json.vacinas);
                    setLotes(json.lotes);
                } else {
                    localStorage.removeItem('token');
                    history.push('/');
                }
            })).catch(e => {
                console.log(e);
                setLoading(false);
                alert('Não foi possível conectar ao servidor.')
            });*/
        } else {
            history.push('/');
        }
    }, [])

    const handleAdd = () => {
        history.push('/vacinar', {grupo: grupo, vacina: vacina, lote: lote})
    };

    return (
        <div>
            <CssBaseline />
                <AppToolbar backButton/>
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
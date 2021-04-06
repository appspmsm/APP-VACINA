import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Button, CircularProgress, Divider, List, ListItem, ListItemText } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import AppToolbar from '../components/AppToolbar';
import { getURL } from '../adapters/api-planilha';

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
    },
    listDiv: {
        paddingBottom: '40px'
    },
    list: {
        maxHeight: '80vh', 
        overflow: 'auto'
    },   
    progress: {
        color: 'blue',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));

function ListaVacinadosPage(props) {
    const classes = useStyles();
    const [grupo, setGrupo] = useState();
    const [vacina, setVacina] = useState();
    const [lote, setLote] = useState();
    const [vacinados, setVacinados] = useState([]);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token){
            if(props.location.state){
                setLoading(true);
                setGrupo(props.location.state.grupo);
                setVacina(props.location.state.vacina);
                setLote(props.location.state.lote);
                const params = new URLSearchParams();
                params.append('token', token);
                params.append('grupo', props.location.state.grupo);
                params.append('vacina', props.location.state.vacina);
                params.append('lote', props.location.state.lote);
                params.append('type', 'getListGrupoVacinaLote')
                fetch(getURL(), {
                    method: 'post',
                    redirect: 'follow',
                    body: params
                }).then((response) => response.json().then((json) => {
                    console.log(json);
                    setLoading(false);
                    if(json.success){
                        setVacinados(json.vacinacoesPaciente);
                    } else {
                        localStorage.removeItem('token');
                        history.push('/');
                    }
                })).catch(e => {
                    console.log(e);
                    setLoading(false);
                    alert('Não foi possível conectar ao servidor.')
                });

            } else {
                history.push('/selecao');
            }

            
        } else {
            history.push('/');
        }
    }, [])

    const handleAdd = () => {
        history.push('/vacinar', {grupo: grupo, vacina: vacina, lote: lote})
    };

    const handleItemClick = (cpf) => {
        history.push('/vacinar', {grupo: grupo, vacina: vacina, lote: lote, cpf: cpf})
    }

    const cpfMask = value => {
        return value
          .replace(/\D/g, '')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})/, '$1-$2')
          .replace(/(-\d{2})\d+?$/, '$1')
    }

    return (
        <div>
            <CssBaseline />
                <AppToolbar backButton logoutButton/>
                <div>
                    <Typography variant="h6">Grupo: {grupo}</Typography>
                    <Typography variant="h6">Vacina: {vacina}</Typography>
                    <Typography variant="h6">Lote: {lote}</Typography>
                </div>        
                <Divider variant="middle" />
                <div className={classes.listDiv}>
                    <Typography variant="h6">Registros de vacinaçao</Typography>
                    <List dense className={classes.list} >
                        {vacinados.map((vacinado) => {
                            return (
                                <ListItem key={vacinado[7]} button divider onClick={() => handleItemClick(vacinado[7])}>
                                    <ListItemText
                                        primary={vacinado[8]}
                                        secondary={'CPF: ' + cpfMask(vacinado[7])}
                                    />
                                </ListItem>
                            )
                        })}
                        
                    </List>
                    {loading && <CircularProgress size={24} className={classes.progress} />}
                </div>
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
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Button, CircularProgress, Divider,Modal, TextField } from '@material-ui/core';
import React from 'react';
import { getURL } from '../adapters/api-planilha';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
    divCenter: {
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

function VacinarPage(props) {
    const classes = useStyles();
    const history = useHistory();
    const [visibility, setVisibility] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [nome, setNome] = React.useState();
    const [dn, setDn] = React.useState();
    const [sexo, setSexo] = React.useState();
    const [dose1, setDose1] = React.useState();
    const [dose2, setDose2] = React.useState();
    const time = new Date();
    const [open, setOpen] = React.useState(false);
    const [modalDose, setModalDose] = React.useState('');

    const body = (
        <div>
          <h2 id="simple-modal-title">Cadastrar {modalDose}ª dose</h2>
          <div id="simple-modal-description">
            <p>Grupo: {props.location.state.grupo}</p>
            <p>Vacina: {props.location.state.vacina}</p>
            <p>Lote: {props.location.state.lote}</p>
            <p>Data: {time.toLocaleDateString()}</p>
            <Button>Confirmar</Button>
          </div>
        </div>
      );

    const handleSearch = (e) => {
        e.preventDefault();
        const cpf = e.target.elements.cpf.value;
        if(!loading) {
            setLoading(true);
            setError(false);
            const params = new URLSearchParams();
            params.append('cpf', cpf);
            params.append('type', 'getPaciente');
            fetch(getURL(), {
                method: 'post',
                redirect: 'follow',
                body: params
            }).then((response) => response.json().then((json) => {
                console.log(json);
                if(json.success){
                    setNome(json.paciente[1]);
                    setDn(json.paciente[2]);
                    setSexo(json.paciente[3]);
                    setDose1(json.dose1[0]);
                    setDose2(json.dose2[0]);
                    //setVisibility(true);
                }else{
                    setError(true);
                }
                setLoading(false);
            }))
        }

    }

    const handleDose = (numero) => {
        setModalDose(numero);
        handleOpen();
    }

    const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
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
                <div className={classes.divCenter}>
                    <Typography variant="h6">Buscar paciente</Typography>
                    <form onSubmit={handleSearch}>
                        <TextField className={classes.tfCpf} id="cpf" label="CPF" name="cpf" error={error} helperText={error ? "CPF não encontrado.": ""} />
                        <div className={classes.wrapper}>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            startIcon={<SearchIcon />}
                            disabled={loading}
                            type="submit"
                        >
                            Buscar
                        </Button>
                        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                        </div>
                    </form>
                </div>
                {visibility ? <div className={classes.pacienteDiv}>
                    <Typography variant="subtitle1">Nome: {nome}</Typography>
                    <Typography variant="subtitle1">Data de nascimento: {dn}</Typography>
                    <Typography variant="subtitle1">Sexo: {sexo}</Typography>
                    <Divider/>
                    <Typography variant="h6">1ª Dose</Typography>
                    {dose1 ? 
                        <div>
                            <Typography variant="subtitle1">Data: {new Date(dose1[2]).toLocaleDateString()}</Typography>
                            <Typography variant="subtitle1">Grupo: {dose1[3]}</Typography>
                            <Typography variant="subtitle1">Vacina: {dose1[4]}</Typography>
                            <Typography variant="subtitle1">Lote: {dose1[5]}</Typography>
                        </div>
                        :
                        <div className={classes.divCenter}>
                            <Button variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={handleDose(1)}>
                                Cadastrar 1ª Dose
                            </Button>
                        </div>
                    }
                    <Divider/>
                    <Typography variant="h6">2ª Dose</Typography>
                    {dose2 ? 
                        <div>
                            <Typography variant="subtitle1">Data: {new Date(dose2[2]).toLocaleDateString()}</Typography>
                            <Typography variant="subtitle1">Grupo: {dose2[3]}</Typography>
                            <Typography variant="subtitle1">Vacina: {dose2[4]}</Typography>
                            <Typography variant="subtitle1">Lote: {dose2[5]}</Typography>
                        </div>
                        :
                        <div className={classes.divCenter}>
                            <Button variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={handleDose(2)}>
                                Cadastrar 2ª Dose
                            </Button>
                        </div>
                    }
                    </div> : null}
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                    >
                        {body}
                    </Modal>
        </div>
    );
}

export default VacinarPage;
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Button, CircularProgress, Divider,Modal, TextField } from '@material-ui/core';
import React, { useEffect } from 'react';
import { getURL } from '../adapters/api-planilha';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { useHistory } from 'react-router';
import AppToolbar from '../components/AppToolbar';
import Dexie from 'dexie';

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
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),

      },
}));

function VacinarPage(props) {
    const classes = useStyles();
    const history = useHistory();
    const [visibility, setVisibility] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [cpf, setCpf] = React.useState();
    const [nome, setNome] = React.useState();
    const [dn, setDn] = React.useState();
    const [sexo, setSexo] = React.useState();
    const [dose1, setDose1] = React.useState();
    const [dose2, setDose2] = React.useState();
    const [grupo, setGrupo] = React.useState();
    const [vacina, setVacina] = React.useState();
    const [lote, setLote] = React.useState();
    const [login, setLogin] = React.useState();
    const time = new Date();
    const [open, setOpen] = React.useState(false);
    const [modalDose, setModalDose] = React.useState('');
    const [loadingModal, setLoadingModal] = React.useState(false);
    const styles = { 
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    };

    useEffect(()=> {
        const token = localStorage.getItem('token');
        const loginStorage = localStorage.getItem('login');
        if(token && loginStorage){
            setLogin(loginStorage);
            if(props.location.state){
                setGrupo(props.location.state.grupo);
                setVacina(props.location.state.vacina);
                setLote(props.location.state.lote);
                if(props.location.state.cpf){
                    handleSearch(null, props.location.state.cpf);
                }
            } else {
                history.push('/selecao')
            }
        } else {
            history.push('/');
        }
    }, [])


    const handleSearch = (e, cpfFromList=null) => {
        let cpf;
        if(cpfFromList){
            cpf = cpfFromList;
        } else {
            e.preventDefault();
            cpf = e.target.elements.cpf.value.replace(/\D/g, '');
        }
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
                    setCpf(json.paciente[0]);
                    setNome(json.paciente[1]);
                    setDn(json.paciente[2]);
                    setSexo(json.paciente[3]);
                    setDose1(json.dose1[0]);
                    setDose2(json.dose2[0]);
                    setVisibility(true);
                }else{
                    setError(true);
                }
                setLoading(false);
            }))
        }

    }

    const handleCadastro = () => {
        if(!loadingModal){
            setLoadingModal(true);
            const params = new URLSearchParams();
            params.append('login', login);
            params.append('cpf', cpf);
            params.append('time', time);
            params.append('grupo', grupo);
            params.append('vacina', vacina);
            params.append('lote', lote);
            params.append('dose', modalDose);
            params.append('type', 'setVacinacao');
            fetch(getURL(), {
                method: 'post',
                redirect: 'follow',
                body: params
            }).then((response) => response.json().then((json) => {
                console.log(json);
                if(json.success){
                    if(modalDose===1) {
                        setDose1([login, cpf, time, grupo, vacina, lote]);
                    } else if(modalDose === 2) {
                        setDose2([login, cpf, time, grupo, vacina, lote]);
                    }
                    handleClose();
                }else{
                    alert('Erro no cadastro')
                }
                setLoadingModal(false);
                setLoading(false);
            })).catch( err => {
                console.log(err.message);
                const db = new Dexie('Vacinas');
                db.version(1).stores({
                    vacinacoes: 'login, cpf, time, grupo, vacina, lote, dose'
                })
                db.vacinacoes.add({
                    login: login,
                    cpf: cpf,
                    time: time,
                    grupo: grupo,
                    vacina: vacina,
                    lote: lote,
                    dose: modalDose
                }).then(response => {
                    if('serviceWorker' in navigator && 'SyncManager' in window) {
                        navigator.serviceWorker.ready.then(function(reg) {
                          return reg.sync.register('sendVacinacao');
                        }).catch(function() {
                          // system was unable to register for a sync,
                          // this could be an OS-level restriction
                          alert('Erro no envio do registro de vacinação');
                        });
                      } else {
                        // serviceworker/sync not supported
                        alert('Erro no envio do registro de vacinação');
                      }
                    }
                );

            });
        }
    }

    const handleDose1 = () => {
        setModalDose(1);
        handleOpen();
    }

    const handleDose2 = () => {
        setModalDose(2);
        handleOpen();
    }

    const handleOpen = () => {
        setOpen(true);
      };
    
    const handleClose = () => {
        setOpen(false);
      };

    const cpfMask = value => {
        return value
          .replace(/\D/g, '')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})/, '$1-$2')
          .replace(/(-\d{2})\d+?$/, '$1')
    }

    const handleOnChange = e => {
        e.target.value = cpfMask(e.target.value);
    }

    const body = (
        <div style={styles} className={classes.paper}>
          <h2 id="simple-modal-title">Cadastrar {modalDose}ª dose</h2>
          <div id="simple-modal-description">
            <p>Grupo: {grupo}</p>
            <p>Vacina: {vacina}</p>
            <p>Lote: {lote}</p>
            <p>Data: {time.toLocaleDateString()}</p>
            <div className={classes.divCenter}>
                <Button variant="contained"
                        color="primary"
                        className={classes.button}
                        disabled={loadingModal}
                        onClick={handleCadastro}>Confirmar</Button>
            </div>
          </div>
        </div>
      );



    return (
        <div>
            <CssBaseline />
                <AppToolbar backButton logoutButton/>
                <div className={classes.divCenter}>
                    <Typography variant="h6">Buscar paciente</Typography>
                    <form onSubmit={handleSearch}>
                        <TextField className={classes.tfCpf} id="cpf" label="CPF" name="cpf" inputProps={{ maxLength: 14 }} error={error} helperText={error ? "CPF não encontrado.": ""} onChange={handleOnChange} />
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
                                onClick={handleDose1}
                                >
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
                                onClick={handleDose2}
                                >
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
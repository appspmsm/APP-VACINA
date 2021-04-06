import React, {useEffect} from 'react';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { getURL } from '../adapters/api-planilha';
import { Backdrop, CircularProgress } from '@material-ui/core';
import AppToolbar from '../components/AppToolbar';

const useStyles = makeStyles((theme) => ({
  stepper: {
    position: 'fixed',
    bottom: 0,
    width: '100%'
  },
  buttons: {
    position: 'fixed',
    bottom: 100,
    right: 20
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  buttonConfirmar: {
    position: 'fixed',
    bottom: 100,
    left: '50%',
    width: 120,
    'margin-left': '-60px'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));



function SelecaoPage(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = ['Selecione o grupo', 'Selecione a vacina', 'Selecione o lote'];
  const [grupo, setGrupo] = React.useState('');
  const [vacina, setVacina] = React.useState('');
  const [lote, setLote] = React.useState('');
  const [grupos, setGrupos] = React.useState([]);
  const [vacinas, setVacinas] = React.useState([]);
  const [lotes, setLotes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const stepSelects = [grupo, vacina, lote];
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      setLoading(true);
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
      });
    } else {
      history.push('/');
    }
  }, [])

  const handleNext = () => {
    setActiveStep((prevStep)=>prevStep+1);
  }

  const handleBack = () => {
    setActiveStep((prevStep)=>prevStep+-1);
  }

  const handleChangeGrupo = (event) => {
    setGrupo(event.target.value);
  };

  const handleChangeVacina = (event) => {
    setVacina(event.target.value);
  };

  const handleChangeLote = (event) => {
    setLote(event.target.value);
  };

  const handleConfirmation = (event) => {
    history.push('/listavacinados', {grupo: grupo, vacina: vacina, lote: lote});

  }


  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
            <FormControl className={classes.formControl}>
              <InputLabel id="grupo-select-label">Grupo</InputLabel>
              <Select
                labelId="grupo-select-label"
                id="grupo-select"
                value={grupo}
                onChange={handleChangeGrupo}
              >
                {grupos.map((grupoItem)=>{
                  return <MenuItem key={grupoItem} value={grupoItem}>{grupoItem}</MenuItem>
                })}
              </Select>
            </FormControl>
        );
      case 1:
        return (
          <FormControl className={classes.formControl}>
          <InputLabel id="vacina-select-label">Vacina</InputLabel>
          <Select
            labelId="vacina-select-label"
            id="vacina-select"
            value={vacina}
            onChange={handleChangeVacina}
          >
            {vacinas.map((vacinaItem)=>{
              return <MenuItem key={vacinaItem} value={vacinaItem}>{vacinaItem}</MenuItem>
            })}
          </Select>
        </FormControl>
        );
      case 2:
        return (
          <FormControl className={classes.formControl}>
          <InputLabel id="lote-select-label">Lote</InputLabel>
          <Select
            labelId="lote-select-label"
            id="lote-select"
            value={lote}
            onChange={handleChangeLote}
          >
            {lotes.map((loteItem)=>{
              return <MenuItem key={loteItem} value={loteItem}>{loteItem}</MenuItem>
            })}
          </Select>
        </FormControl>
        );
      default:
        return 'Unknown step';
    }
  }

  return (
    
    <div>
    <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
    </Backdrop>
    <CssBaseline />
          <AppToolbar logoutButton/>

        {activeStep === steps.length ? (
          <Container>
            <p>Grupo: {grupo}</p>
            <p>Vacina: {vacina}</p>
            <p>Lote: {lote}</p>
            <div className={classes.centerDiv}>
              <Button
                variant="contained"
                color="primary"
                className={classes.buttonConfirmar}
                onClick={handleConfirmation}
              >Confirmar</Button>
            </div>
          </Container>
        ) : (
          <div>
            <div style={{textAlign: "center"}}>{getStepContent(activeStep)}</div>
            <div className={classes.buttons}>
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Voltar
              </Button>
              <Button
                disabled={stepSelects[activeStep]===''}
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                Próximo
              </Button>
            </div>
          </div>
        )}
      
      <div className={classes.stepper}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </div>
    </div>
  );
}

export default SelecaoPage;
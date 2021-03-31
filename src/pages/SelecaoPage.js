import React from 'react';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
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
import { getGrupos, getVacinas, getLotes } from '../adapters/api-planilha';
import { useHistory } from 'react-router-dom';

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
}));



function SelecaoPage() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = ['Selecione o grupo', 'Selecione a vacina', 'Selecione o lote'];
  const [grupo, setGrupo] = React.useState('');
  const [vacina, setVacina] = React.useState('');
  const [lote, setLote] = React.useState('');
  const grupos = getGrupos();
  const vacinas = getVacinas();
  const lotes = getLotes();
  const stepSelects = [grupo, vacina, lote];
  const history = useHistory();

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
    <CssBaseline />
          <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Vacinas
          </Typography>
        </Toolbar>
      </AppBar>

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
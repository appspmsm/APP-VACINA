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
import { Backdrop, CircularProgress, MobileStepper } from '@material-ui/core';
import AppToolbar from '../components/AppToolbar';
import Dexie from 'dexie';

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
  const steps = ['Selecione a dose', 'Selecione o grupo', 'Selecione a vacina', 'Selecione o lote', 'Selecione o local', 'Selecione o profissional'];
  const [dose, setDose] = React.useState('');
  const [grupo, setGrupo] = React.useState('');
  const [vacina, setVacina] = React.useState('');
  const [lote, setLote] = React.useState('');
  const [local, setLocal] = React.useState('');
  const [profissional, setProfissional] = React.useState('');
  const [doses, setDoses] = React.useState(['Primeira', 'Segunda', 'Única']);
  const [grupos, setGrupos] = React.useState([]);
  const [vacinas, setVacinas] = React.useState([]);
  const [lotes, setLotes] = React.useState([]);
  const [locais, setLocais] = React.useState([]);
  const [profissionais, setProfissionais] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const stepSelects = [dose, grupo, vacina, lote, local, profissional];
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const db = new Dexie('Cadastros');
    db.version(3).stores({
      cadastros: '++id, cpf, status',
      selecao: '++id'
    })
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
              setGrupos(json.grupos.map(v=>v[0]).filter((v,i,s) => s.indexOf(v) === i).sort());
              setVacinas(json.vacinas.map(v=>v[0]));
              setLotes(json.lotes.map(v=>v[0]));
              setLocais(json.locais.map(v=>v[0]));
              setProfissionais(json.profissionais.map(v=>v[0]));
              db.selecao.put({
                id: 0,
                vacinas: json.vacinas.map(v=>v[0]),
                lotes: json.lotes.map(v=>v[0]),
                grupos: json.grupos,
                locais: json.locais.map(v=>v[0]),
                profissionais: json.profissionais.map(v=>v[0])
              });
          } else {
              localStorage.removeItem('token');
              history.push('/');
          }
      })).catch(e => {
          console.log(e);
          db.selecao.get(0).then(selecaodb => {
            console.log('dbload');
            if(selecaodb){
              setVacinas(selecaodb.vacinas);
              setLotes(selecaodb.lotes);
              setGrupos(selecaodb.grupos.map(v=>v[0]).filter((v,i,s) => s.indexOf(v) === i).sort());
              setLocais(selecaodb.locais);
              setProfissionais(selecaodb.profissionais);
            }else{
              alert('Não foi possível conectar ao servidor, verifique sua conexão com a internet.')
            }
            setLoading(false);
          }).catch(e => {
            console.log(e);
            alert('Não foi possível conectar ao servidor, verifique sua conexão com a internet.')
            setLoading(false);
          });
          
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

  const handleChangeDose = (event) => {
    setDose(event.target.value);
  };

  const handleChangeGrupo = (event) => {
    setGrupo(event.target.value);
  };

  const handleChangeVacina = (event) => {
    setVacina(event.target.value);
  };

  const handleChangeLote = (event) => {
    setLote(event.target.value);
  };

  const handleChangeLocal = (event) => {
    setLocal(event.target.value);
  };

  const handleChangeProfissional = (event) => {
    setProfissional(event.target.value);
  };

  const handleConfirmation = (event) => {
    history.push('/cadastros', {dose: dose, grupo: grupo, vacina: vacina, lote: lote, local: local, profissional: profissional});

  }


  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
            <FormControl className={classes.formControl}>
              <InputLabel id="dose-select-label">Dose</InputLabel>
              <Select
                labelId="dose-select-label"
                id="dose-select"
                value={dose}
                onChange={handleChangeDose}
              >
                {doses.map((doseItem)=>{
                  return <MenuItem key={doseItem} value={doseItem}>{doseItem}</MenuItem>
                })}
              </Select>
            </FormControl>
        );
      case 1:
        return (
            <FormControl className={classes.formControl}>
              <InputLabel id="grupo-select-label">Categoria</InputLabel>
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
      case 2:
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
      case 3:
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
        case 4:
          return (
            <FormControl className={classes.formControl}>
            <InputLabel id="local-select-label">Local</InputLabel>
            <Select
              labelId="local-select-label"
              id="local-select"
              value={local}
              onChange={handleChangeLocal}
            >
              {locais.map((localItem)=>{
                return <MenuItem key={localItem} value={localItem}>{localItem}</MenuItem>
              })}
            </Select>
          </FormControl>
          );
        case 5:
            return (
              <FormControl className={classes.formControl}>
              <InputLabel id="profissional-select-label">Profissional Responsável</InputLabel>
              <Select
                labelId="profissional-select-label"
                id="profissional-select"
                value={profissional}
                onChange={handleChangeProfissional}
              >
                {profissionais.map((profissionalItem)=>{
                  return <MenuItem key={profissionalItem} value={profissionalItem}>{profissionalItem}</MenuItem>
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
            <p>Dose: {dose}</p>
            <p>Categoria: {grupo}</p>
            <p>Vacina: {vacina}</p>
            <p>Lote: {lote}</p>
            <p>Local: {local}</p>
            <p>Profissional: {profissional}</p>
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
            <MobileStepper
          variant="dots"
          steps={steps.length}
          position="bottom"
          activeStep={activeStep}
          nextButton={
              <Button
                disabled={stepSelects[activeStep]===''}
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                Próximo
              </Button>
          }
          backButton={
            <Button disabled={activeStep === 0} onClick={handleBack}>
                Voltar
              </Button>
          }
        />
          </div>
        )}
      
      {/*<div className={classes.stepper}>
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
        
        </div>*/}
      
    </div>
  );
}

export default SelecaoPage;
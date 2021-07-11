import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import AppToolbar from '../components/AppToolbar';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormHelperText, InputLabel, MenuItem, Select, Step, StepLabel, Stepper, TextField, Typography, useMediaQuery } from '@material-ui/core';
import { cpfMask, dnMask } from '../util/mask';
import { getURL } from '../adapters/api-planilha';
import HandwriteCanvas from '../components/HandwriteCanvas';
import Keyboard from 'react-simple-keyboard';
import "react-simple-keyboard/build/css/index.css";
import Dexie from 'dexie';
import { validateCPF, validateDate } from '../util/validacao';
import { getFaixaEtaria, getIdade } from '../util/idade';

const useStyles = makeStyles((theme) => ({
  divCenter: {
    width: '100%',
    textAlign: 'center',
  },
  btGroup: {
    paddingTop: '10px'
  },
  textField: {
    display: 'block',
    width: '90%',
    maxWidth: '500px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  canvas: {
    display: 'block',
    width: '300px',
    height: '300px',
    border: '2px solid',
    cursor: 'crosshair',
    marginTop: '10px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  buttons: {
    position: 'fixed',
    bottom: 30,
    left: '50%',
    width: 200,
    'margin-left': '-100px'
  },
  stepperDiv: {
    width: '100%'
  },
  stepper: {
    paddingLeft: 0
  },
  keyboard: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  kbTheme: {
    fontSize: '23px'
  },
  error: {
    color: 'red'
  },
  progress: {
    color: 'blue',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  formControl: {
    margin: theme.spacing(1),
    width: '90%',
  },
  dados: {
    marginBottom: 80
  }
}));

function CadastroPage(props) {
  const classes = useStyles();
  const history = useHistory();
  const [cpf, setCpf] = React.useState('');
  const [nome, setNome] = React.useState('');
  const [dn, setDn] = React.useState('');
  const [nomeError, setNomeError] = React.useState(false);
  const [cpfError, setCpfError] = React.useState(false);
  const [dnError, setDnError] = React.useState(false);
  const [canvas, setCanvas] = React.useState();
  const [canvasData, setCanvasData] = React.useState();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = ['CPF', 'Nome', 'Data de nascimento', 'Assinatura', 'Categoria'];
  const stepSelects = [nome, dn, cpf];
  const nameKb = React.useRef();
  const [layout, setLayout] = React.useState("numericCPF");
  const [inputName, setInputName] = React.useState("nameCpf");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [token, setToken] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const matches = useMediaQuery('(min-height:590px)');
  const [subgrupo, setSubgrupo] = React.useState('');
  const [subgrupoError, setSubgrupoError] = React.useState(false);
  const [subgrupos, setSubgrupos] = React.useState([]);
  const db = new Dexie('Cadastros');
  db.version(3).stores({
    cadastros: '++id, cpf, status',
    selecao: '++id'
  });

  useEffect(() => {
    const lsToken = localStorage.getItem('token');
    if (!lsToken) {
      history.push('/');
    } else if(!props.location.state){
      history.push('/selecao');
    } else {
      setToken(lsToken);
      db.selecao.get(0).then(selecao => {
        const subgruposFiltered = selecao.grupos.filter(grupo => grupo[0] === props.location.state.grupo).map(grupo => grupo[1]).sort();
        setSubgrupos(subgruposFiltered);
      });
    }
  }, [])

  const handleNomeChange = (e) => {
    const newname = e.target.value.replace(/[^A-ZÇ ]/g, '')
    setNome(newname);
    nameKb.current.setInput(newname);
  }

  const handleCPFChange = (e) => {
    nameKb.current.setInput(e.target.value);
    e.target.value = cpfMask(e.target.value);
    if (e.target.value.length === 14 && !validateCPF(e.target.value)) {
      setCpfError(true);
    } else if (e.target.value.length < 14 || validateCPF(e.target.value)) {
      setCpfError(false);
    }
    setCpf(e.target.value);
  }

  const handleDnChange = (e) => {
    nameKb.current.setInput(e.target.value);
    e.target.value = dnMask(e.target.value);
    if (e.target.value.length === 10 && !validateDate(e.target.value)) {
      setDnError(true);
    } else if (e.target.value.length < 10 || validateDate(e.target.value)) {
      setDnError(false);
    }
    setDn(e.target.value);
  }

  const handleNext = () => {
    if (activeStep === 0 && !validateCPF(cpf)) {
      setCpfError(true);
    } else if (activeStep === 1 && !nome) {
      setNomeError(true);
    } else if (activeStep === 2 && !validateDate(dn)) {
      setDnError(true);
    }else if(activeStep === 4 && !subgrupo) {
      setSubgrupoError(true);
    } else {
      if (activeStep === 0) {
        setLayout('default');
      } else if (activeStep === 1) {
        setLayout('numericDn');
      } else if (activeStep === 3) {
        setCanvasData(canvas.current.toDataURL('image/png').split(';base64,')[1]);
        if(props.location.state.grupo === 'Faixa Etária'){
          setSubgrupo(getFaixaEtaria(dn));
        }
      }
      setInputName(getInputName(activeStep + 1));
      setActiveStep((prevStep) => prevStep + 1);
    }
  }

  const handleBack = () => {
    setInputName(getInputName(activeStep - 1));
    if (activeStep === 1) {
      setLayout('numericCPF')
    }
    if (activeStep === 2) {
      setLayout('default');
    }
    if (activeStep === 3) {
      setLayout('numericDn');
    }
    setActiveStep((prevStep) => prevStep - 1);
  }

  const getInputName = (step) => {
    switch (step) {
      case 0: return 'nameCpf';
      case 1: return 'nameInput';
      case 2: return 'nameDn';
      default: break;
    }
  }

  const addCadastroIdb = (status) => {
    return db.cadastros.add({
      nome: nome,
      dn: dn,
      cpf: cpf,
      assinatura: canvasData,
      vacina: props.location.state.vacina,
      lote: props.location.state.lote,
      grupo: props.location.state.grupo,
      dose: props.location.state.dose,
      local: props.location.state.local,
      profissional: props.location.state.profissional,
      subgrupo: subgrupo,
      time: new Date(Date.now()).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      status: status,
      token: token
    })
  }

  const updateCadastroIdb = (id) => {
    return db.cadastros.update(id, { status: "ok" });
  }

  const handleConfirmation = () => {
    if (nome && validateDate(dn) && validateCPF(cpf) && canvasData && subgrupo) {
      setLoading(true);
      addCadastroIdb('pend').then(responseIdb => {
        const params = new URLSearchParams();
        params.append('token', token);
        params.append('nome', nome);
        params.append('dn', dn);
        params.append('cpf', cpf);
        params.append('type', 'setCadastro');
        params.append('assinatura', canvasData);
        params.append('vacina', props.location.state.vacina);
        params.append('lote', props.location.state.lote);
        params.append('grupo', props.location.state.grupo);
        params.append('dose', props.location.state.dose);
        params.append('local', props.location.state.local);
        params.append('profissional', props.location.state.profissional);
        params.append('subgrupo', subgrupo);
        params.append('time', new Date(Date.now()).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }))
        fetch(getURL(), {
          method: 'post',
          redirect: 'follow',
          body: params
        }).then((response) => {
          response.json().then((json) => {
            if (json.success) {
              updateCadastroIdb(responseIdb);
              setLoading(false);
              history.push('/cadastros', {
                vacina: props.location.state.vacina,
                lote: props.location.state.lote,
                grupo: props.location.state.grupo,
                dose: props.location.state.dose,
                local: props.location.state.local,
                profissional: props.location.state.profissional
              });
            } else {
              alert('Não foi possível enviar o cadastro.')
            }
          })
        }).catch(err => {
          console.log(err);
          if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready.then(function (reg) {
              setLoading(false);
              history.push('/cadastros', {
                vacina: props.location.state.vacina,
                lote: props.location.state.lote,
                grupo: props.location.state.grupo,
                dose: props.location.state.dose,
                local: props.location.state.local,
                profissional: props.location.state.profissional
              });
              return reg.sync.register('sendCadastros');
            }).catch((e) => {
              // system was unable to register for a sync,
              // this could be an OS-level restriction
              setLoading(false);
              alert('Não foi possível armazenar o cadastro no dispositivo. Sincronia em plano de fundo não disponível.');
            });
          } else {
            // serviceworker/sync not supported
            setLoading(false);
            alert('Não foi possível armazenar o cadastro no dispositivo. Service Worker não disponível.');
          }
        });
      }).catch(e => {
        // erro no armazenamento na indexedDB
        setLoading(false);
        alert('Não foi possível armazenar o cadastro no dispositivo.');
      });
    } else {
      setDialogOpen(true);
    }
  }

  const kbOnChange = (input) => {
    switch (activeStep) {
      case 0:
        const maskcpf = cpfMask(input);
        if (maskcpf.length === 14 && !validateCPF(maskcpf)) {
          setCpfError(true);
        } else if (maskcpf.length < 14 || validateCPF(maskcpf)) {
          setCpfError(false);
        }
        setCpf(maskcpf);
        break;
      case 1:
        setNome(input.replace(/[^A-ZÇ ]/g, ''));
        break;
      case 2:
        const maskdn = dnMask(input);
        if (maskdn.length === 10 && !validateDate(maskdn)) {
          setDnError(true);
        } else if (maskdn.length < 10 || validateDate(maskdn)) {
          setDnError(false);
        }
        setDn(maskdn);
        break;
      default: break;
    }

  }

  const kbOnKeyPress = (button) => {
    switch (button) {
      case '{prox}':
        handleNext();
        break;
      case '{volt}':
        handleBack();
        break;
      case '{shift}':
        handleShift();
        break;
      default: break;
    }
  }

  const kbOnRender = (kb) => {
    console.log(kb);
    /*switch(kb.options.inputName){
      case 'nameCpf': 
        kb.setCaretPosition(cpf.length);
        break;
      case 'nameInput':
        kb.setCaretPosition(nome.length);
        break;
      case 'nameDn':
        kb.setCaretPosition(dn.length);
        break;
      default: break;
    }
    console.log(kb);*/
  }

  const kbOnInit = (kb) => {
    kb.setInput(cpf.replace(/\D/g, ''), 'nameCpf');
    kb.setInput(nome, 'nameInput');
    kb.setInput(dn.replace(/\D/g, ''), 'nameDn');
  }

  const handleShift = () => {
    console.log(layout);
    const newLayoutName = layout === "default" ? "shift" : "default";
    console.log(newLayoutName)
    setLayout(newLayoutName);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const handleChangeSubgrupo = (event) => {
    setSubgrupo(event.target.value);
    setSubgrupoError(false);
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <div className={classes.divCenter}>
            <TextField
              error={cpfError}
              fullWidth
              id="cpfInput"
              className={classes.textField}
              label="CPF"
              helperText={cpfError ? "CPF inválido." : ""}
              inputProps={{ inputMode: "none", style: { fontSize: '23px' } }}
              onChange={handleCPFChange}
              value={cpf}></TextField>
          </div>
        );
      case 1:
        return (
          <div className={classes.divCenter}>
            <TextField
              error={nomeError}
              fullWidth
              id="nameInput"
              className={classes.textField}
              label="Nome"
              helperText={nomeError ? "Nome inválido." : ""}
              value={nome}
              inputProps={{ inputMode: "none", style: { fontSize: '23px' } }}
              onChange={handleNomeChange}></TextField>
          </div>
        );
      case 2:
        return (
          <div className={classes.divCenter}>
            <TextField
              error={dnError}
              fullWidth
              id="dnInput"
              className={classes.textField}
              label="Data de Nascimento"
              helperText={dnError ? "Data inválida." : ""}
              inputProps={{ inputMode: "none", style: { fontSize: '23px' } }}
              onChange={handleDnChange}
              value={dn}>
            </TextField>
          </div>
        );
      case 3:
        return (
          <div className={classes.divCenter}>
            <HandwriteCanvas setCanvas={setCanvas}></HandwriteCanvas>
            <div className={classes.buttons}>
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Voltar
                </Button>
              <Button
                disabled={stepSelects[activeStep] === ''}
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                Próximo
                </Button>
            </div>
          </div>
        );
        case 4:
          return (
            <div className={classes.divCenter}>
              <FormControl className={classes.formControl} error={subgrupoError}>
                <InputLabel id="vacina-select-label">Categoria do grupo prioritário</InputLabel>
                <Select
                  labelId="vacina-select-label"
                  id="vacina-select"
                  value={subgrupo}
                  onChange={handleChangeSubgrupo}
                >
                {subgrupos.map((subgrupoItem)=>{
                  return <MenuItem key={subgrupoItem} value={subgrupoItem}>{subgrupoItem}</MenuItem>
                })}
                </Select>
                {subgrupoError && <FormHelperText>Selecione a categoria</FormHelperText>}
              </FormControl>
              <div className={classes.buttons}>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Voltar
                  </Button>
                <Button
                  disabled={stepSelects[activeStep] === ''}
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  Próximo
                  </Button>
              </div>
            </div>
          );
      default:
        return 'Unknown step';
    }
  }

  /*return (
      <div>
          <AppToolbar backButton logoutButton/>
          <div className={classes.divCenter}>
              <canvas ref={canvas} className={classes.canvas} width={300} height={300}></canvas>
              <ButtonGroup color="primary" aria-label="outlined primary button group" className={classes.btGroup}>
                  <Button onClick={handleApagarButton}>Apagar</Button>
                  <Button onClick={handleConfirmarButton}>Confirmar</Button>
              </ButtonGroup>
              <TextField fullWidth className={classes.textField} label="Nome" value={nome} onChange={handleNomeChange}></TextField>
              <TextField fullWidth className={classes.textField} label="Data de Nascimento" inputProps={{ inputMode:"numeric" }} onChange={handleDnChange}></TextField>
              <TextField fullWidth className={classes.textField} label="CPF" inputProps={{ inputMode:"numeric" }} onChange={handleCPFChange}></TextField>
              <Button variant="contained" color="primary" className={classes.button}>Enviar</Button>
          </div>
          <div>

          </div>
      </div>
  );*/

  return (
    <div>
      <AppToolbar backButton logoutButton />
      {matches &&
        <div className={classes.stepperDiv}>
          <Stepper activeStep={activeStep} alternativeLabel className={classes.stepper}>
            {steps.map((label, index) => {
              const stepProps = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </div>}
      {activeStep === steps.length ? (
        <div className={classes.dados}>
          <Typography>Dose: {props.location.state.dose}</Typography>
          <Typography>Vacina: {props.location.state.vacina}</Typography>
          <Typography>Lote: {props.location.state.lote}</Typography>
          <Typography>Grupo: {props.location.state.grupo}</Typography>
          <Typography>Categoria: {subgrupo}</Typography>
          <Typography>Local: {props.location.state.local}</Typography>
          <Typography>Profissional: {props.location.state.profissional}</Typography>
          <Typography>CPF: {validateCPF(cpf) ? cpf : <span className={classes.error}>CPF inválido</span>}</Typography>
          <Typography>Nome: {nome ? nome : <span className={classes.error}>Não preenchido</span>}</Typography>
          <Typography>Data de Nascimento: {validateDate(dn) ? dn : <span className={classes.error}>Data inválida</span>}</Typography>
          <Typography>Idade: {validateDate(dn) ? getIdade(dn) + ' anos' : <span className={classes.error}>Data inválida</span>}</Typography>
          <Typography>Assinatura: {!canvasData && <span className={classes.error}>Não assinado</span>}</Typography>
          <div>
            {canvasData && <img src={'data:image/png;base64,' + canvasData} alt="assinatura" width={100}></img>}
          </div>
          <div className={classes.buttons}>
            <Button disabled={loading} onClick={handleBack}>
              Voltar
                </Button>
            <Button
              disabled={loading}
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleConfirmation}
            >Confirmar</Button>
            {loading && <CircularProgress size={24} className={classes.progress} />}
          </div>
        </div>
      ) : (
        <div>
          <div style={{ textAlign: "center" }}>{getStepContent(activeStep)}</div>

        </div>
      )}
      {activeStep < 3 && <div className={classes.keyboard}>
        <Keyboard
          layout={{
            shift: [
              "q w e r t y u i o p",
              "a s d f g h j k l ç",
              "z x c v b n m {backspace}",
              "{shift} {space} {prox}"
            ],
            default: [
              "Q W E R T Y U I O P",
              "A S D F G H J K L Ç",
              "Z X C V B N M {backspace}",
              "{volt} {space} {prox}"
            ],
            numericCPF: [
              "1 2 3",
              "4 5 6",
              "7 8 9",
              "0 {backspace}",
              "{prox}"
            ],
            numericDn: [
              "1 2 3",
              "4 5 6",
              "7 8 9",
              "0 {backspace}",
              "{volt} {prox}"
            ]
          }}
          display={{
            "{shift}": "⇧",
            "{prox}": "Próximo",
            "{volt}": "Voltar",
            "{space}": " ",
            "{backspace}": "⌫"
          }}
          buttonAttributes={[
            {
              attribute: 'style',
              value: 'flex-basis:68%',
              buttons: '{space} 0'
            }
          ]}
          theme={classes.kbTheme + " hg-theme-default"}
          layoutName={layout}
          keyboardRef={r => (nameKb.current = r)}
          onChange={kbOnChange}
          onKeyPress={kbOnKeyPress}
          onInit={kbOnInit}
          inputName={inputName}
          useMouseEvents={true}
        />
      </div>}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Erro no cadastro"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Informe CPF, nome, data de nascimento e assinatura.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}

export default CadastroPage;
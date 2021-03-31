import {Switch, Route} from "react-router-dom";
import LoginPage from './pages/LoginPage'
import SelecaoPage from './pages/SelecaoPage'
import ListaVacinadosPage from './pages/ListaVacinadosPage'
import VacinarPage from "./pages/VacinarPage";

export const Routes = () => {
    return (
        <Switch>
            <Route path={'/vacinas/'} component={LoginPage} exact />
            <Route path={'/vacinas/selecao'} component={SelecaoPage} />
            <Route path={'/vacinas/listavacinados'} component={ListaVacinadosPage} />
            <Route path={'/vacinas/vacinar'} component={VacinarPage} />
        </Switch>
    )
}
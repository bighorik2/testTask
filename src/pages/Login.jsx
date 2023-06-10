import { useNavigate, useParams, Navigate } from "react-router-dom";
import React from "react";
import "../styles/login.css"
import icon from "../icons/loginIcon.svg"
function withRouter(Component) {
    function ComponentWithRouter(props) {
        let params = useParams()
        let navigate = useNavigate()
        return <Component {...props} params={params} Navigate={navigate} />
    }
    return ComponentWithRouter
}

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { idTextValue: "", tokenTextValue: "", isBadId: false, isBadToken: false, isNavigate: false }
    }

    Button_onClick() {
        if (this.state.idTextValue === "")
            this.setState({ isBadId: true });
        else if (this.state.tokenTextValue === "")
            this.setState({ isBadToken: true });
        else
            this.setState({ isNavigate: true });
    }

    render() {
        console.log(this.state.idTextValue);
        return (
            <div className="login-wrapper">
                {this.state.isNavigate && <Navigate to={'/Chat/' + this.state.idTextValue + '/' + this.state.tokenTextValue} />}
                <div className="login-wrapper-before">
                    <span className="login-icon"><img src={icon}></img></span>
                    <div className="login-sign">WhatsApp Test</div>
                </div>
                <div className="login-window">
                    <div className="login-window-wrapper">
                        <div className="login-title">Авторизуйтесь в системе Green-Api</div>

                        <input className={`login-input ${this.state.isBadId && 'login-input_bad-input'}`}
                            placeholder="idInstance"
                            value={this.state.idTextValue}
                            onChange={(e) => this.setState({ idTextValue: e.currentTarget.value, isBadId: false })}></input>

                        <input className={`login-input ${this.state.isBadToken && 'login-input_bad-input'}`}
                            placeholder="apiTokenInstance"
                            value={this.state.tokenTextValue}
                            onChange={(e) => this.setState({ tokenTextValue: e.currentTarget.value, isBadToken: false })}></input>

                        <button className="login-button" onClick={() => this.Button_onClick()}>Войти</button>
                    </div>
                </div>


            </div>

        );
    }
}



export default withRouter(Login);

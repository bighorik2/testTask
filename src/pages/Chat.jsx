import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import '../styles/chat.css'
import newDialogIcon from "../icons/newDialogIcon.svg"
import personIcon from "../icons/personIcon.svg"
import lockIcon from "../icons/lockIcon.svg"
import sendIcon from "../icons/sendIcon.svg"
import arrowIcon from "../icons/arrowIcon.svg"
import ChatRequests from '../apiRequests/ChatRequests'
import moment from "moment/moment";
import searchIcon from '../icons/searchIcon.svg'
import subMenuIcon from '../icons/subMenuIcon.svg'
import statusIcon from '../icons/statusIcon.svg'
import communityIcon from '../icons/communityIcon.svg'
import filterIcon from '../icons/filterIcon.svg'
import archiveIcon from '../icons/archiveIcon.svg'

function withRouter(Component) {
    function ComponentWithRouter(props) {
        let params = useParams()
        let navigate = useNavigate()
        return <Component {...props} params={params} Navigate={navigate} />
    }
    return ComponentWithRouter
}
const chatRequests = new ChatRequests();

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = { dialogList: [], messagesMap: [], sideIsOpened: true, messengerValue: "", numberInputValue: "", selectedDialog: -1 }
        this.ReciveMessage = this.ReciveMessage.bind(this);
    }

    componentDidMount() {
        var id = this.props.params.id
        var token = this.props.params.token
        let timerId = setInterval(this.ReciveMessage, 1000, id, token);
    }

    //79523587952
    async ReciveMessage(id, token) {

        var result = await chatRequests.ReciveMessage(id, token);
        if (result.data !== null && result.data !== undefined) {
            var number = result.data.body.senderData.chatId.toString().substring(0, 11);
            var newMessagesMap = this.state.messagesMap.slice();
            var newDialogMessages = this.GetDialogMessages(number)
            if (newDialogMessages !== undefined) {
                if (newDialogMessages.data.findIndex((element) => element.receiptId == result.data.receiptId) === -1) {
                    newDialogMessages.data.push({ receiptId: result.data.receiptId, sent: false, text: result.data.body.messageData.textMessageData.textMessage, date: moment().format("DD.MM.YYYY") })
                    newMessagesMap[this.GetDialogMessagesIndex(number)] = newDialogMessages;
                    this.setState({ messagesMap: newMessagesMap })
                }
            }

        }
    }


    AddNumber_onClick() {
        if (this.state.numberInputValue !== "") {
            var newDialogList = this.state.dialogList.slice();
            newDialogList.push(this.state.numberInputValue);
            var newMessagesMap = this.state.messagesMap.slice();
            newMessagesMap.push({ key: this.state.numberInputValue, data: new Array() });

            this.setState({ dialogList: newDialogList, messagesMap: newMessagesMap, sideIsOpened: false, numberInputValue: "" })
        }
    }
    AddNumber_onKeyDown(e) {
        if (e.keyCode == 13)
            this.AddNumber_onClick(this.state.numberInputValue)
    }

    SendMessage_onClick() {
        if (this.state.messengerValue !== "") {
            var selectedDialog = this.state.selectedDialog;
            var number = this.state.dialogList[selectedDialog];

            try {
                chatRequests.SendMessage(this.props.params.id, this.props.params.token, number, this.state.messengerValue)
            }
            catch { }
            var newMessagesMap = this.state.messagesMap.slice();
            var newDialogMessages = this.GetDialogMessages(number);
            newDialogMessages.data.push({ receiptId: 0, sent: true, text: this.state.messengerValue, date: moment().format("DD.MM.YYYY") })
            newMessagesMap[this.GetDialogMessagesIndex(number)] = newDialogMessages
            this.setState({ messengerValue: "", messagesMap: newMessagesMap })
        }
    }
    TextArea_onKeyDown(e) {
        if (e.keyCode == 13)
            this.SendMessage_onClick(this.state.messengerValue)
    }

    GetDialogMessages(number) {
        return this.state.messagesMap
            .find((element) => element.key === number)
    }
    GetDialogMessagesIndex(number) {
        return this.state.messagesMap
            .findIndex((element) => element.key === number)
    }



    render() {
        console.log(this.state.selectedDialog)
        console.log(this.state.dialogList[this.state.selectedDialog])
        console.log(this.state.messagesMap)
        console.log(this.GetDialogMessages(this.state.dialogList[this.state.selectedDialog]))
        return (
            <div className="chat">

                <div className={`side-panel ${this.state.sideIsOpened && 'opened'}`}>
                    <div className="side-panel_header">
                        <img src={arrowIcon} className="side-panel_header-btn"
                            onClick={() => this.setState({ sideIsOpened: false })}></img>
                        <div className="side-panel_header-text">Новый чат</div>
                    </div>
                    <div className="side-panel_body">
                        <input className="input"
                            placeholder="Введите номер собеседника"
                            value={this.state.numberInputValue}
                            onChange={(e) => this.setState({ numberInputValue: e.currentTarget.value })}
                            onKeyDown={(e) => this.AddNumber_onKeyDown(e)}></input>
                        <img className="send-btn"
                            onClick={() => this.AddNumber_onClick()} src={sendIcon} />
                    </div>

                </div>

                <div className="chat-list-wrapper">
                    <div className="chat-list-panel">
                        <div className="personal-icon-wrapper">
                            <img className="personal-icon" src={personIcon}></img>
                        </div>
                        <img className="subicon" style={{ padding: 0 }} src={communityIcon}></img>
                        <img className="subicon" src={statusIcon}></img>
                        <img className="chat-list_new-dialog-icon" src={newDialogIcon}
                            onClick={() => this.setState({ sideIsOpened: !this.state.sideIsOpened })}></img>
                        <img className="subicon" src={subMenuIcon}></img>
                    </div>
                    <div className="find-chat-wrapper">
                        <span className="find-chat-icon"><img className="find-chat-icon" src={searchIcon}></img></span>
                        <input className="input find-chat-input" placeholder="Поиск или новый чат" />

                        <img className="subicon" src={filterIcon}></img>
                    </div>
                    <div className="archiver-wrapper">
                        <img className="archive-icon" src={archiveIcon} />
                        <div className="archive-title"> В архиве</div>
                    </div>
                    <div className="chat-list">
                        {this.state.dialogList !== undefined && this.state.dialogList.map((element, index) => {
                            var messages = this.GetDialogMessages(element);
                            var lastMessage = {};
                            if (messages === undefined || messages.data.length === 0)
                                lastMessage = { text: "Нет сообщений", date: "" }
                            else
                                lastMessage = messages.data[messages.data.length - 1];

                            return <div className={`chat-list-element ${this.state.selectedDialog == index && "selected"}`}
                                onClick={() => this.setState({ selectedDialog: index })}
                                key={index}>
                                <div className="chat-list-element_icon-wrapper">
                                    <img className="chat-list-element_icon" src={personIcon}></img>
                                </div>
                                <div className="chat-list-element_info">
                                    <div className="chat-list-element_info-top">
                                        <div className="chat-list-element_info-name">{element}</div>
                                        <div className="chat-list-element_info-date">{lastMessage.date && lastMessage.date}</div>
                                    </div>
                                    <span className="chat-list-element_info-text">{lastMessage.text && lastMessage.text}</span>
                                </div>
                            </div>
                        })}
                        <div className="chat-list_additional-information">
                            <img className="chat-list_additional-information-icon" src={lockIcon}></img>Ваши личные сообщения
                            <a className="chat-list_additional-information-link" href="/"> защищены сквозным шифрованием</a>
                        </div>
                    </div>

                </div>
                {this.state.selectedDialog !== -1 ?
                    <div className="chat-messenger-wrapper">
                        <div className="chat-messenger_info-panel">
                            <div className="personal-icon-wrapper">
                                <img className="personal-icon" src={personIcon}></img>
                            </div>
                            <div className="chat-messenger_info-panel-info-wrapper">
                                <div className="chat-messenger_info-panel-number">{this.state.dialogList[this.state.selectedDialog]}</div>
                                <div className="chat-messenger_info-panel-subtitle">Данные контакта</div>
                            </div>
                            <div><img className="subicon" src={searchIcon}></img></div>
                            <div><img className="subicon" src={subMenuIcon}></img></div>


                        </div>

                        <div className="chat-messenger_message-view">

                            {this.state.selectedDialog !== -1 ?
                                <>
                                    {this.GetDialogMessages(this.state.dialogList[this.state.selectedDialog])
                                        .data
                                        .map((element, index) => {

                                            return <div className="chat-messenger_message-wrapper" key={index}>
                                                <div className={`chat-messenger_message ${element.sent ? "sent" : "recived"}`}> {element.text}
                                                </div>
                                            </div>
                                        })}
                                </>
                                :
                                <></>
                            }


                        </div>
                        <div className="chat-messenger_send-panel">
                            <input className="input"
                                placeholder="Введите сообщение"
                                value={this.state.messengerValue}
                                onKeyDown={(e) => this.TextArea_onKeyDown(e)}
                                onChange={(e) => this.setState({ messengerValue: e.currentTarget.value })}></input>
                            <img className="send-btn" src={sendIcon}
                                onClick={() => this.SendMessage_onClick()} />
                        </div>
                    </div>
                    :
                    <div className="filler">
                        <div className="filler-img"></div>
                        <div className="filler-title">WhatsApp Test</div>
                        <div className="filler-text">Отправляйте и&nbsp;получайте сообщения без необходимости оставлять телефон подключённым.<br />Используйте WhatsApp одновременно на&nbsp;четырёх связанных устройствах и&nbsp;одном телефоне.</div>
                    </div>}

            </div>

        );
    }
}



export default withRouter(Chat);

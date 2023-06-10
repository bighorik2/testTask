import axios from "axios";
class ChatRequests {


    async SendMessage(id, token, chatId, text) {
        await axios.post(`https://api.green-api.com/waInstance${id}/sendMessage/${token}`,
            {
                message: text,
                chatId: chatId + "@c.us"
            })

    }
    async ReciveMessage(id, token) {
        var result = await axios.get(`https://api.green-api.com/waInstance${id}/receiveNotification/${token}`)
        if (result.data !== null && result.data !== undefined) {
            axios.delete(`https://api.green-api.com/waInstance${id}/deleteNotification/${token}/${result.data.receiptId}`)
        }
        return result;

    }
}

export default ChatRequests;
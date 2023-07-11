import React, { useEffect, useRef, useState } from 'react';
import loading from './Infinity-1s-200px.svg'
import './App.css';

const ChatBubble = ({ isUser, chatMessage }: { isUser: boolean, chatMessage: string }): JSX.Element => {
  return (
    <div className={`msg ${isUser ? 'right': 'left'}-msg`}>
      <div className="msg-img"></div>
      <div className="msg-bubble">
        <div className="msg-info">
          <div className="msg-info-name">{isUser ? 'YOU': 'BOT'}</div>
        </div>
        <div className="msg-text">{chatMessage}</div>
      </div>
    </div>
  )
}

const App = ():JSX.Element => {
  const [userQuery, setUserQuery] = useState('');
  const [conversations, setConversations] = useState<Array<any>>([]);
  const [isFetching, setIsFetching] = useState(false);

  const onQueryEnter = (event: any) => setUserQuery(event?.target?.value);

  const askQuery = async () => {
    try {
      setIsFetching(true)
      const queryResponse = await fetch(`https://esspoc.azurewebsites.net/api/getresponsefromweb`, {
        method: 'POST',
        body: JSON.stringify({ query: userQuery }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
      });
      const jsonResponse = await queryResponse?.json();
      setUserQuery('')
      setIsFetching(false)
      if(jsonResponse?.status === 200) {
        setConversations([...conversations, { q: userQuery, a: jsonResponse?.data }])
        localStorage.setItem('wizr_convos', JSON.stringify([...conversations, { q: userQuery, a: jsonResponse?.data }]))
      } else {
        alert('Oops, an Error Occured !!!!');
      }
    } catch (error) {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    const previousConvos = localStorage.getItem('wizr_convos');
    if(previousConvos) {
      const previousConvosAsArray = JSON.parse(previousConvos)
      setConversations(previousConvosAsArray)
    }
  }, []);

  return (
    <div className="App">
      <div className="msger-chat">
        {conversations?.map((conv, index) => <React.Fragment key={index}>
          {conv?.q && <ChatBubble isUser={true} chatMessage={conv.q} />}
          {conv?.a && <ChatBubble isUser={false} chatMessage={conv.a} />}
        </React.Fragment>)}
      </div>
      <form className="userEntryContainer">
          <input 
            disabled={isFetching} 
            className="queryInput" 
            type="text" 
            placeholder="Ask me a question" 
            value={userQuery} 
            onChange={onQueryEnter}
          />
          {isFetching ? 
            <img className="App-logo" src={loading}/> : 
            <button
              type="submit"
              disabled={!userQuery?.length} 
              className="queryButton" 
              onClick={askQuery}
            >Ask me !</button>}
      </form>
    </div>
  );
}

export default App;

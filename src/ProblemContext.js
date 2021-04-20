import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
const ChatContextClass = React.createContext({});

const COLORS = ['#2a9d8f', '#023e8a'];

const UserWrapper = styled.div`
  border: 1px solid #eee;
  padding: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #eee;
  width: 200px;
`;

const Button = styled.button`
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 5px;
  margin-left: 10px;
  width: 100px;
`;

const Row = styled.div`
  display: flex;
`;

const MessageWrap = styled.div`
  margin: 20px 10px 40px 10px;
`;

const Message = styled.div`
  border-radius: 15px;
  padding: 20px;
  background-color: ${props => props.color || '#777'};
  margin: 5px 0px;
  color: white;
  width: 400px;
`;

const MessagesWrap = styled.div`
  padding: 0px 40px;
  height: calc(100vh - 40px);
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  overflow-y: scroll;
  margin: 20px;
`;

const Setup = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Content = styled.div``;

const ChatProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  const addUser = username => {
    setUsers([...users, username]);
  };

  const removeUser = username => {
    setUsers(users.filter(u => u === username));
  };

  const addMessage = ({ username, content }) => {
    // setMessages(prevMessages => [
    //   ...prevMessages,
    //   {
    //     date: new Date(),
    //     username,
    //     content,
    //   },
    // ]);
    setMessages([
      ...messages,
      {
        date: new Date(),
        username,
        content,
      },
    ]);
  };

  return (
    <ChatContextClass.Provider
      value={{
        getUsers: () => users,
        getMessages: () => messages,
        addMessage,
        addUser,
        removeUser,
      }}
    >
      {children}
    </ChatContextClass.Provider>
  );
};

const InputWithAction = ({ onSubmit, label }) => {
  const [content, setContent] = useState('');
  return (
    <div>
      <Input
        value={content}
        onChange={e => {
          setContent(e.target.value);
        }}
      />
      <Button
        onClick={() => {
          onSubmit(content);
          setContent('');
        }}
      >
        {label}
      </Button>
    </div>
  );
};

const User = ({ username }) => {
  const { addMessage, removeUser } = useContext(ChatContextClass);

  useEffect(() => {
    // on mount, add join message
    addMessage({ username, content: 'Joined' });

    return () => {
      addMessage({ username, content: 'Left' });
    };
  }, []);

  return (
    <UserWrapper>
      <div style={{ padding: 5 }}>{username}</div>
      <InputWithAction
        label="Send"
        onSubmit={content => {
          addMessage({ username, content });
        }}
      />
      <div
        style={{ color: 'red', padding: 5, fontStyle: 'italic', cursor: 'pointer' }}
        onClick={() => removeUser(username)}
      >
        Leave
      </div>
    </UserWrapper>
  );
};

const Inner = () => {
  const { getUsers, getMessages, addUser } = useContext(ChatContextClass);

  return (
    <Row>
      <Setup>
        <div style={{ flex: 1 }}>
          <InputWithAction
            label="Add User"
            onSubmit={username => {
              addUser(username);
            }}
          />
        </div>
        <div>
          {getUsers().map(u => (
            <User key={u} username={u} />
          ))}
        </div>
      </Setup>
      <MessagesWrap>
        {getMessages().map(({ username, content, date }) => (
          <MessageWrap key={date.getTime()}>
            <label style={{ padding: '0px 10px' }}>
              {username} <i style={{ color: '#888', float: 'right' }}>on {date.toLocaleString()}</i>
            </label>
            <Message color={COLORS[getUsers().indexOf(username)]}>
              <Content>{content}</Content>
            </Message>
          </MessageWrap>
        ))}
      </MessagesWrap>
    </Row>
  );
};

const ProblemContext = () => {
  return (
    <ChatProvider>
      <Inner />
    </ChatProvider>
  );
};

export default ProblemContext;

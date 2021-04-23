/**
 * QuillJS: https://quilljs.com/
 * React QuillJS: https://github.com/zenoamaro/react-quill
 * React Router: https://reactrouter.com/
 */

import { useContext, useState, createContext, useEffect } from 'react';
import styled from 'styled-components';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import { BrowserRouter as Router, Switch, Route, Link, useParams, useHistory } from 'react-router-dom';
const BlogContextClass = createContext({});

const Nav = styled.nav`
  background: #023e8a;
  color: white;

  ul {
    display: flex;
    list-style: none;
    margin: 0px;
    padding: 20px;

    li {
      padding: 0px 20px;
    }

    a {
      text-decoration: none;
      color: white;
    }
  }
`;

const Content = styled.div`
  margin: 0px 100px;
  padding: 40px 0px;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px dotted #888;
  font-size: 20px;
  padding: 10px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  margin-top: 60px;
  background-color: #023e8a;
  color: white;
  padding: 10px;
  font-size: 20px;
  border: none;
  border-radius: 5px;
`;

const Alert = styled.div`
  background-color: #eee;
  padding: 10px;
  font-size: 20px;
  border: none;
  border-radius: 5px;
`;

const PostWrapper = styled.div`
  padding: 10px 0px;
`;

const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const addPost = ({ title, content }) => {
    setPosts([...posts, { id: new Date().getTime(), title, content }]);
  };

  const getPosts = () => posts;
  const getPostById = id => posts.find(p => `${p.id}` === `${id}`);

  return (
    <BlogContextClass.Provider
      value={{
        addPost,
        getPosts,
        getPostById,
      }}
    >
      {children}
    </BlogContextClass.Provider>
  );
};

const Post = () => {
  const { id } = useParams();
  const { getPostById } = useContext(BlogContextClass);

  const post = getPostById(id);

  if (!post) return <div>Post Not Found with ID: {id}</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
};

const Home = () => {
  const { getPosts } = useContext(BlogContextClass);
  const length = getPosts().length;
  return (
    <div>
      <h1>Welcome to the Blog ({length})</h1>
      {length === 0 && (
        <Alert>
          There are no entries in this blog, <Link to="/create">create one</Link>!
        </Alert>
      )}
      <Posts />
    </div>
  );
};

const Create = () => {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { addPost } = useContext(BlogContextClass);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="New Post..." />
      <div>
        <RichText onChange={setContent} />
      </div>
      <Button
        onClick={() => {
          addPost({
            title,
            content,
          });

          history.push('/');
        }}
      >
        Submit
      </Button>
    </div>
  );
};

const RichText = ({ onChange }) => {
  const { quill, quillRef } = useQuill();

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        onChange(`${quill.root.innerHTML}`);
      });
    }
  }, [quill, onChange]);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <div ref={quillRef} />
    </div>
  );
};

const Posts = () => {
  const { getPosts } = useContext(BlogContextClass);

  return getPosts().map(p => (
    <div key={p.id}>
      <PostWrapper>
        <Link to={`/post/${p.id}`}>{p.title}</Link>
      </PostWrapper>
    </div>
  ));
};

export default function Blog() {
  return (
    <BlogProvider>
      <Router>
        <Nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/create">Create</Link>
            </li>
          </ul>
        </Nav>
        <Content>
          <Switch>
            <Route path="/create">
              <Create />
            </Route>
            <Route path="/post/:id">
              <Post />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Content>
      </Router>
    </BlogProvider>
  );
}

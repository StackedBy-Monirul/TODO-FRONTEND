'use cleint'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { Cookies } from 'react-cookie';
import { getAPI } from './Api';

const GetUser = () => {
  const navigate = useRouter()
  const [user, setUser] = useState<any|null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  
  useEffect(() => {
    const token = new Cookies().get("todo-token") || null;
    if(token) {
      getAPI("auth/check", token.token)
        .then((response) => {
          if (response.status === 200) {
            setUser(response.data.data);
            setAuthenticated(true);
          } else {
            setUser(null);
            setAuthenticated(false);
            navigate.push('/login');
          }
        })
        .catch((error) => {
          console.error("Auth check failed:", error);
          setUser(null);
          setAuthenticated(false);
          navigate.push('/login');
        });
    } else {
      navigate.push('/login')
    }
  }, [])
  
  return {user, authenticated}
}

export default GetUser
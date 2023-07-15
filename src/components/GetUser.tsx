import axios from 'axios';
import { navigate } from 'gatsby';
import React, { useEffect, useState } from 'react'
import { Cookies } from 'react-cookie';

const GetUser = () => {
  const [user, setUser] = useState<any|null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    const token = new Cookies().get("todo-token") || null;
    if(token) {
      axios
          .get("http://localhost:8000/api/v1/auth/check", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.token}`,
            },
          })
          .then((response) => {
            setUser(response.data.data);
            setAuthenticated(true);
          })
          .catch((error) => {
            setUser(null);
            setAuthenticated(false);
            navigate('/login')
          });
    } else {
      navigate('/login')
    }
  }, [])
  return {user, authenticated}
}

export default GetUser
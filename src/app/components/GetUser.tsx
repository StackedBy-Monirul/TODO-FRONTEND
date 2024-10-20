import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { Cookies } from 'react-cookie';

const GetUser = () => {
  const navigate = useRouter()
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
            navigate.push('/login')
          });
    } else {
      navigate.push('/login')
    }
  }, [])
  return {user, authenticated}
}

export default GetUser
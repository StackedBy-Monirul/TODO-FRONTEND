import axios from "axios";
import React, { useState } from "react";
import { Cookies } from "react-cookie";

interface Params {
  baseUrl: string;
  headers: any;
  method: string;
}
const getToken: any = new Cookies().get("todo-token");
let token = "";
if (getToken) {
  token = getToken.token;
}

let postConfig: Params = {
  baseUrl: "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  method: "post",
};

const postAPI = async (
  url: string,
  token: string | null,
  data: any
): Promise<any> => {
  if (token) {
    postConfig = {
      ...postConfig,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return await axios({
    ...postConfig,
    url: `${postConfig.baseUrl}/${url}`,
    data,
  })
    .then((response) => {
      return {
        status: response.status,
        data: response.data,
      };
    })
    .catch((error) => {
      return {
        status: error.status,
        data: error.response,
      };
    });
};
let getConfig: Params = {
  baseUrl: "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  method: "get",
};

const getAPI = async (url: string, token: string): Promise<any> => {
  if (token) {
    getConfig = {
      ...getConfig,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return await axios({
    ...getConfig,
    url: `${getConfig.baseUrl}/${url}`,
  })
    .then((response) => {
      return {
        status: response.status,
        data: response.data,
      };
    })
    .catch((error) => {
      return {
        status: error.status,
        data: error.response,
      };
    });
};

let putConfig: Params = {
  baseUrl: "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  method: "put",
};

const putAPI = async (url: string, token: string, data: any): Promise<any> => {
  if (token) {
    putConfig = {
      ...putConfig,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return await axios({
    ...putConfig,
    url: `${putConfig.baseUrl}/${url}`,
    data,
  })
    .then((response) => {
      return {
        status: response.status,
        data: response.data,
      };
    })
    .catch((error) => {
      return {
        status: error.status,
        data: error.response,
      };
    });
};

let deleteConfig: Params = {
  baseUrl: "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  method: "delete",
};

const deleteAPI = async (url: string, token: string): Promise<any> => {
  if (token) {
    deleteConfig = {
      ...deleteConfig,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return await axios({
    ...deleteConfig,
    url: `${deleteConfig.baseUrl}/${url}`,
  })
    .then((response) => {
      return {
        status: response.status,
        data: response.data,
      };
    })
    .catch((error) => {
      return {
        status: error.status,
        data: error.response,
      };
    });
};

export { postAPI, getAPI, putAPI, deleteAPI };

import { httpClient } from "./AxiosHelper";
export const createROOM = async (roomid)=>{
  const response = await httpClient.post(`/api/v1/rooms`,roomid,{
    headers:{
      "Content-Type":"text/plain",
    },
  })
  return response.data;
}

export const joinChatApi = async (roomid)=>{
  const response = await httpClient.get(`/api/v1/rooms/${roomid}`)
  return response.data;
}

export const getMessages = async(roomid,size=50,page=0)=>{
  const response = await httpClient.get(`/api/v1/rooms/${roomid}/messages?size=${size}&page=${page}`)
  return response.data;
}
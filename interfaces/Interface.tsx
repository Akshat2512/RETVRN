import { ImageSourcePropType } from "react-native";



export interface ChatListProp{
    id: number, 
    responder: "AI" | "User",
    message: string, 
    emotion: string | null,
    time: string | null,
} 

export interface SentimentListProp{
    id: number,
    sentiment: string | null,
    sentiment_score: string, 
    emotion: string | null,
    tags: string | null,
    time: string
}

export interface RelationLists{
    id: number;
    name: string;
    age: string;
    relationType: string;
    time: string | null;
    profileImg: string | ImageSourcePropType | null;
    visit: number;
    visited_on: string | null;
}

export interface ChatStream{
    Type: string, 
    content: string, 
}

export interface ChatMessage{
    responder: string, 
    msg_id: string,
    message: string,
    time: string
}
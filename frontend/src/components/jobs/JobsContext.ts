import {Context, createContext} from "react";

export interface JobsContextValue {}

export const JobsContext: Context<JobsContextValue> = createContext({} as JobsContextValue);

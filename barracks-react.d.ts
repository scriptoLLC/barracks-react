/// <reference types="react" />

interface IGenericObj {
  [key: string]: any
}

interface IBarracksModel {
  namespace: string,
  state: IGenericObj,
  reducers: {[key: string]: (state?: IGenericObj, data?: any) => IGenericObj},
  effects: {[key: string]: (state?: IGenericObj, data?: any, send?: (action: string, data: any) => void, done?: (err?: Error) => void) => void},
  subscriptions: {[key: string]: (send?: (action: string, data: any) => void, done?: (err?: Error) => void) => void}
}

declare function bearact(component: React.Component<any, any>, model: IBarracksModel)
export = bearact
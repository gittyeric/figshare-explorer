import { NamedAction, NamedReducer, NamedStore, createNamedStore } from '../state';
import { Unsubscribe } from 'redux';

export class StatefulService<STATE, ACTION_BASE extends NamedAction> {

    private store: NamedStore<STATE>;
    private listeners: Map<number, (s: STATE) => void>;
    private listenIndex: number;

    constructor(storeName: string, reducer: NamedReducer<STATE>, initState: STATE) {
        this.store = createNamedStore(storeName, reducer, initState);
        this.listeners = new Map();
        this.listenIndex = 0;
    }

    getState = (): STATE => {
        return this.store.getState();
    }

    dispatch = (action: ACTION_BASE): void => {
        this.store.dispatch(action);
        const newState = this.getState();
        this.listeners.forEach( (listener) => listener( newState ));
    }
    
    listen = (listener: (s: STATE) => void): Unsubscribe => {
        const curIndex = this.listenIndex;
        this.listenIndex++;
        this.listeners.set(curIndex, listener);

        return () => {
            this.listeners.delete(curIndex);
        };
    }

}
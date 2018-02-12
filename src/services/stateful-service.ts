import { NamedAction, NamedReducer, NamedStore, createNamedStore } from '../state';

export class StatefulService<STATE, ACTION_BASE extends NamedAction> {

    private store: NamedStore<STATE>;

    constructor(storeName: string, reducer: NamedReducer<STATE>, initState: STATE) {
        this.store = createNamedStore(storeName, reducer, initState);
    }

    getState = (): STATE => {
        return this.store.getState();
    }

    dispatch = (action: ACTION_BASE): void => {
        this.store.dispatch(action);
    }
    
    listen = (listener: (s: STATE) => void) => {
        return this.store.subscribe(listener);
    }

}
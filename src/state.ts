import { createStore, Store, Dispatch, Action, Unsubscribe } from 'redux';

export interface NamedAction extends Action {
    type: string;
    storeName: string;
}

export type NamedReducer<S> = (s: S, a: NamedAction) => S;

interface State {}

var state: State = {};

export class NamedStore<S> implements Store<State> {

    dispatch: Dispatch<State>;
    reducer: NamedReducer<S>;
    private storeName: string;
    private mainStore: Store<State>;

    constructor(mainStore: Store<State>, reducer: NamedReducer<S>, initState: S, storeName: string) {
        this.mainStore = mainStore;
        this.reducer = reducer;
        this.dispatch = mainStore.dispatch as Dispatch<S>;
        this.storeName = storeName;

        state[storeName] = initState;
    }

    getState(): S {
        return this.mainStore.getState()[this.storeName] as S;
    }

    subscribe(listener: (newState: S) => void): Unsubscribe {
        return this.mainStore.subscribe( () => {
            listener(this.getState());
        } );
    }

    replaceReducer(nextReducer: (state: S, action: Action) => S): void {
        throw Error('Should not call replaceReducer on NamedStore');
        // this.mainStore.replaceReducer(nextReducer);
    }

}

// tslint:disable-next-line:no-any
const namedStores: { [name: string]: NamedStore<any> } = {};

const masterReducer = (s: State, a: NamedAction) => {
    const subState = s[a.storeName];
    const subStore = namedStores[a.storeName];

    if (subStore) {
        const newSubState = subStore.reducer(subState, a);
        var newState = {... state};
        newState[a.storeName] = newSubState;
        return newState;
    } else {
        return s;
    }
};

const store = createStore<State>(masterReducer, state);

// Creates a facade to the global redux store so that only the inner named Store state can be modified
export function createNamedStore<S>(
    storeName: string, reducer: NamedReducer<S>, initState: S): NamedStore<S> {
    
    if ( namedStores[storeName] ) {
        throw Error('Creating 2 stores for ' + storeName);
    }

    return new NamedStore<S>(store, reducer, initState, storeName);
}
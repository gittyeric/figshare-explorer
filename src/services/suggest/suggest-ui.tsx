import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import SuggestService from 'src/services/suggest/suggest';
import { Unsubscribe } from 'redux';
import { Suggestions, ItemTypeState } from 'src/services/suggest/actions';

// tslint:disable-next-line:no-any
export interface SuggestProps extends RouteComponentProps<any> {
    suggest: SuggestService;
}

// tslint:disable-next-line:no-any
export function asSuggestProps(p: RouteComponentProps<any>, Suggest: SuggestService): SuggestProps {
    return { ...p, suggest: Suggest };
}

const createExploreBlock = (title: string, className: string, sugs: ItemTypeState) => {
    const suggestions = sugs.suggested as Suggestions;
    if (sugs.isError || !suggestions || suggestions.scores.length === 0) {
        return (<div />);
    }
    if (sugs.isLoading) {
        return (
            <div className="loading">
                <h3>{title}</h3>
                <p className={className}>Loading...</p>
            </div>
        );
    }

    const list = suggestions.scores.map((score) =>
        (<a href={score.link}>{score.name}</a>));

    return (
        <div>
            <h3>{title}</h3>
            <p className={className}>{list}</p>
        </div>
    );
};

// tslint:disable-next-line:no-any
export class SuggestBox extends React.Component<SuggestProps> {

    private service: SuggestService;
    private unlisten: Unsubscribe;

    // tslint:disable-next-line:no-any
    constructor(params: SuggestProps) {
        super(params);
        this.service = params.suggest;
    }

    componentWillMount() {
        const instance = this;
        this.unlisten = this.service.listen(state => instance.forceUpdate());
    }

    componentWillUnmount() {
        this.unlisten();
    }

    render() {
        const state = this.service.getState();
        const papers = createExploreBlock('Papers', 'papers', state.papers);
        const tags = createExploreBlock('Tags', 'tags', state.tags);
        const cats = createExploreBlock('Categories', 'cats', state.categories);
        const authors = createExploreBlock('Authors', 'authors', state.authors);

        return (
            <div id="similar_papers">
                <h2>Explore Similar</h2>
                {papers}
                {authors}
                {cats}
                {tags}
            </div>
        );
    }

}
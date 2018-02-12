jest.dontMock('jquery');

// import { Result } from './actions';

it('works', () => {
    // Search.getState();
});

/*it('Can fetch Figshare API Search data', () => {
    // expect.assertions(2);

    Search.find('biology').then( (state) => {
        const results = (state.results as Result[]);
        expect(results.length)
            .toEqual(Search.getState().pageSize);

        expect(results[0].id.length).toBeGreaterThan(0);
    } );
});

it('Can fetch Figshare API Article data', () => {
    // expect.assertions(1);
    
    const knownId = '555';

    Search.getArticle(knownId).then( (result) => {
        expect(result.id).toEqual(knownId);
    } );
});*/
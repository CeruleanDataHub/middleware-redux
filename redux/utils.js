export default async function dispatchThunk(thunk, f) {
    const response = await thunk.dispatch(f);
    if (response.error) {
        return thunk.rejectWithValue({ body: null, error: response.payload.error });
    }
    const { payload: { body }} = response;
    return { body, error: null };
}
